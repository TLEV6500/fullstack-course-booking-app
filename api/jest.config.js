module.exports = {
    setupFiles: ["<rootDir>/tests/jest.setup.js"],
    testEnvironment: "node",
    reporters: [
        "default",
        ["jest-junit", { outputFile: "reports/integrations-report.xml" }],
    ],
};
