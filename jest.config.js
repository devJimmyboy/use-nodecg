/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
	preset: "ts-jest",
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,tsx}"],
	testEnvironment: "jsdom",
};
