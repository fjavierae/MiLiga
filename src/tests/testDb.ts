import { query } from "../lib/db";

const TEST_TABLES = [
	"player_join_requests",
	"players",
	"users",
	"matches",
	"teams",
	"leagues",
	"formations",
];

export const resetTestDatabase = async (): Promise<void> => {
	const existingTables = await query<{ tablename: string }>(
		`SELECT tablename
		 FROM pg_tables
		 WHERE schemaname = 'public'
			 AND tablename = ANY($1::text[])`,
		[TEST_TABLES]
	);

	if (existingTables.rows.length === 0) {
		return;
	}

	const tableList = existingTables.rows
		.map(({ tablename }) => `"${tablename}"`)
		.join(", ");

	await query(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`);
};