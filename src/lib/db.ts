/**
 * @module Database
 * @description Database connection management utility for PostgreSQL.
 * Provides a persistent connection pool and utility functions to execute 
 * queries safely and efficiently using the 'pg' library.
 */

import { Pool, type PoolClient, type QueryResultRow } from "pg";

/**
 * Database connection string retrieved from environment variables.
 * Should follow the format: postgresql://user:password@host:port/database
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured. Please check your environment variables.");
}

/**
 * PostgreSQL Connection Pool.
 * Manages a collection of reusable connections to optimize performance 
 * and prevent the overhead of creating a new connection for every request.
 */
export const pool = new Pool({
  connectionString,
  max: 10,                 // Maximum number of clients in the pool
  idleTimeoutMillis: 30_000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10_000, // Return an error if a connection takes longer than 10s
});

/**
 * Executes a single SQL query using a client from the pool.
 * Best suited for simple queries where transaction management is not required.
 * * @template T - The expected shape of the database rows (extends QueryResultRow).
 * @param {string} text - The SQL query string (use $1, $2 for parameterized queries).
 * @param {unknown[]} [values] - Array of values to replace the placeholders in the query.
 * @returns {Promise<QueryResult<T>>} A promise that resolves to the query results.
 */
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string, 
  values?: unknown[]
) => {
  return pool.query<T>(text, values);
};

/**
 * Executes a custom logic block while ensuring safe client acquisition and release.
 * This is the recommended pattern for complex operations and database transactions 
 * (BEGIN/COMMIT/ROLLBACK).
 * * @template T - The return type of the provided callback function.
 * @param {function(PoolClient): Promise<T>} callback - An async function that receives the database client.
 * @returns {Promise<T>} The result of the callback execution.
 * @throws Will re-throw any error encountered during the callback execution.
 */
export const withClient = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();

  try {
    // Execute the provided database logic
    return await callback(client);
  } finally {
    /**
     * Critical: The 'finally' block ensures the client is returned to the pool 
     * regardless of whether the operation succeeded or failed, preventing connection leaks.
     */
    client.release();
  }
};