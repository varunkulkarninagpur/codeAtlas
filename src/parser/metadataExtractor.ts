// TODO: Extract class metadata (annotations, imports, fields) from Java AST

import { JavaClassMetadata } from "../common/types";

export class MetadataExtractor {
  public extract(ast: unknown, filePath: string): JavaClassMetadata {
    // TODO: Implement parsing checks for Spring annotations and fields
    return {
      filePath,
      packageName: "",
      className: "",
      type: "UNKNOWN",
      injectedDependencies: [],
      imports: [],
    };
  }
}
