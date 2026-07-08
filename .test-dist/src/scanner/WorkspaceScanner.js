import * as fs from "fs/promises";
import * as path from "path";
let vscode;
try {
    vscode = require("vscode");
}
catch {
    // Running outside VS Code (e.g. CLI/tests)
}
/**
 * WorkspaceScanner is responsible for discovering Java source files
 * within the active VS Code workspace folders, or a specified local directory.
 */
export class WorkspaceScanner {
    constructor(basePath) {
        this.basePath = basePath;
    }
    /**
     * Scans the workspace folders or the specified path for Java files, excluding common build, IDE, and dependency directories.
     * @returns A promise resolving to an array of absolute file paths.
     */
    async scan() {
        if (this.basePath) {
            const results = [];
            const scanDir = async (dir) => {
                try {
                    const entries = await fs.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry.name);
                        if (entry.isDirectory()) {
                            if (["target", "build", "bin", ".gradle", ".idea", "node_modules"].includes(entry.name)) {
                                continue;
                            }
                            await scanDir(fullPath);
                        }
                        else if (entry.isFile() && entry.name.endsWith(".java")) {
                            results.push(fullPath);
                        }
                    }
                }
                catch {
                    // Keep going
                }
            };
            await scanDir(this.basePath);
            return results;
        }
        if (!vscode || !vscode.workspace || !vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return [];
        }
        try {
            const includePattern = "**/*.java";
            const excludePattern = "{**/target/**,**/build/**,**/bin/**,**/.gradle/**,**/.idea/**,**/node_modules/**}";
            const files = await vscode.workspace.findFiles(includePattern, excludePattern);
            return files.map((file) => file.fsPath);
        }
        catch (error) {
            return [];
        }
    }
}
