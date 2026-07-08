import * as assert from "assert";
import { JavaParser } from "../../src/parser/JavaParser";

describe("JavaParser Tests", () => {
  let parser: JavaParser;

  beforeEach(() => {
    parser = new JavaParser();
  });

  it("should successfully parse valid Java code and return an AST", () => {
    const javaSource = `
      package com.example;
      public class UserController {
          private final UserService userService;
          public UserController(UserService userService) {
              this.userService = userService;
          }
      }
    `;
    const ast = parser.parse(javaSource);
    assert.ok(ast);
    assert.strictEqual(typeof ast, "object");
  });

  it("should throw an error for empty or whitespace-only source code", () => {
    assert.throws(() => {
      parser.parse("");
    }, /Cannot parse empty or whitespace-only source code/);

    assert.throws(() => {
      parser.parse("   \n  \t ");
    }, /Cannot parse empty or whitespace-only source code/);
  });

  it("should throw a meaningful error for invalid Java code", () => {
    const invalidJavaSource = `
      public class UserController {
          invalid syntax here
      }
    `;
    assert.throws(() => {
      parser.parse(invalidJavaSource);
    }, /Java parsing failed/);
  });
});
