import * as assert from "assert";
import * as Module from "module";
// Create a mock for the vscode module before importing the scanner
const mockVscode = {
    workspace: {
        workspaceFolders: undefined,
        findFiles: async (_include, _exclude) => {
            return [];
        },
    },
};
// Hook into module loading to intercept 'vscode' imports
const originalRequire = Module.prototype.require;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Module.prototype.require = function (id, ...args) {
    if (id === "vscode") {
        return mockVscode;
    }
    return originalRequire.apply(this, [id, ...args]);
};
// Now import the class under test
import { WorkspaceScanner } from "../../src/scanner/WorkspaceScanner";
describe("WorkspaceScanner Tests", () => {
    beforeEach(() => {
        mockVscode.workspace.workspaceFolders = undefined;
        mockVscode.workspace.findFiles = async () => [];
    });
    it("should return empty array if no workspace folders are open", async () => {
        mockVscode.workspace.workspaceFolders = undefined;
        const scanner = new WorkspaceScanner();
        const files = await scanner.scan();
        assert.deepStrictEqual(files, []);
    });
    it("should return files found by vscode.workspace.findFiles", async () => {
        mockVscode.workspace.workspaceFolders = [{ uri: { fsPath: "/workspace" } }];
        mockVscode.workspace.findFiles = async (include, exclude) => {
            assert.strictEqual(include, "**/*.java");
            assert.ok(exclude?.includes("target"));
            return [
                { fsPath: "/workspace/src/UserController.java" },
                { fsPath: "/workspace/src/UserService.test.java" },
            ];
        };
        const scanner = new WorkspaceScanner();
        const files = await scanner.scan();
        assert.deepStrictEqual(files, [
            "/workspace/src/UserController.java",
            "/workspace/src/UserService.test.java",
        ]);
    });
    it("should handle exceptions by returning an empty array", async () => {
        mockVscode.workspace.workspaceFolders = [{ uri: { fsPath: "/workspace" } }];
        mockVscode.workspace.findFiles = async () => {
            throw new Error("VS Code findFiles failed");
        };
        const scanner = new WorkspaceScanner();
        const files = await scanner.scan();
        assert.deepStrictEqual(files, []);
    });
});
