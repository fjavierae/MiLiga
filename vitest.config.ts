import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		environment: "node",
		fileParallelism: false,
		maxWorkers: 1,
		sequence: {
			concurrent: false,
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(rootDir, "src"),
		},
	},
});