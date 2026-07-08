# Contributing to CodeAtlas

Thank you for your interest in contributing to CodeAtlas! Below are guidelines to help get your development environment set up and outline the pull request process.

---

## Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or above)
* [Git](https://git-scm.com/)

### Steps
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/varunkulkarninagpur/codeAtlas.git
   cd codeAtlas
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Commands

### Building
Compile the TypeScript code using the `esbuild` bundler:
```bash
npm run compile
```

### Running Tests
Execute the Mocha-based unit and integration test suite:
```bash
npm run test
```

### Watching for Changes
Run the bundler in watch mode to rebuild automatically as files change:
```bash
npm run watch
```

---

## Pull Request Guidelines

1. **Keep it Focused**: Ensure your pull request implements a single feature or bug fix.
2. **Write Unit Tests**: Every code modification or new analysis rule must be accompanied by comprehensive tests under `test/unit/`.
3. **No Unused Code**: Clean up unused variables or imports to keep the strict TypeScript compiler happy.
4. **Follow Formatting Guidelines**: Run prettier on your changes before submitting them.

---

## Coding Standards

* **Strict TypeScript**: Never use the `any` type.
* **Composition Over Inheritance**: Prefer writing simple components that interact through constructors.
* **Separation of Concerns**: Keep VS Code extension wrapper APIs isolated from the core static analysis engine.
* **Preserve Documentation**: Retain all docstrings and file comments.
