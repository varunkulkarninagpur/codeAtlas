import { parse } from "java-parser";

/**
 * JavaParser is a thin wrapper around the java-parser library.
 * It is responsible solely for converting Java source code into an AST.
 */
export class JavaParser {
  /**
   * Parses Java source code and returns the AST.
   * @param sourceCode The Java source code string to parse.
   * @returns The generated AST.
   * @throws Error if the source code is invalid, empty, or parsing fails.
   */
  public parse(sourceCode: string): unknown {
    if (!sourceCode || sourceCode.trim() === "") {
      throw new Error("Cannot parse empty or whitespace-only source code.");
    }

    try {
      return parse(sourceCode);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Java parsing failed: ${message}`);
    }
  }
}
