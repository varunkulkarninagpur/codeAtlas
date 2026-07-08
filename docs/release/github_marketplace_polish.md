# CodeAtlas GitHub & VS Code Marketplace Polish Checklist

This document details recommendations for optimizing discoverability, community health, and Marketplace metadata for the CodeAtlas v1.0.0 launch.

---

## 1. GitHub Polish Checklist

### 1.1 Readme Badges
Add these status badges at the top of `README.md` once the repo is public:
```markdown
[![CI Build Status](https://github.com/varunkulkarninagpur/codeAtlas/actions/workflows/ci.yml/badge.svg)](https://github.com/varunkulkarninagpur/codeAtlas/actions)
[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/codeatlas.codeatlas.svg)](https://marketplace.visualstudio.com/items?itemName=codeatlas.codeatlas)
[![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/codeatlas.codeatlas.svg)](https://marketplace.visualstudio.com/items?itemName=codeatlas.codeatlas)
[![License](https://img.shields.io/github/license/varunkulkarninagpur/codeAtlas.svg)](LICENSE)
```

### 1.2 GitHub Repository Configuration
*   **Topics**: Tag the repository with:
    `vs-code-extension`, `spring-boot`, `java`, `static-analysis`, `architecture-validation`, `dependency-graph`, `typescript`, `linter`.
*   **Discussions**: Enable GitHub Discussions in settings to handle community support, Q&A, and feature requests, keeping the Issue Tracker focused entirely on verified parser/rule bugs.
*   **Release Strategy**: Maintain tags matching semantic versioning (`v1.0.0`). For every release, run `npx vsce package` and attach the packaged `.vsix` binary to the GitHub Release page as a secondary download option.

### 1.3 Issue & PR Templates
Create standard templates under `.github/` to ensure high-quality contributions:
*   **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.md`): Ask for OS, VS Code version, a code snippet reproducing the parsing failure or false violation, and expected behavior.
*   **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.md`): Ask for the problem solved, proposed solution, and alternative designs.
*   **Pull Request Template** (`.github/pull_request_template.md`): Require a checkbox confirming unit tests have been added, the build compiles green, and no lint warnings exist.

---

## 2. VS Code Marketplace Optimization

### 2.1 Metadata Validation (`package.json`)
The following fields are configured in `package.json` to ensure clean listing and search indexation:
*   `displayName`: `"CodeAtlas"` (Clean, branded title).
*   `description`: `"Static analysis and architecture validator for Spring Boot projects."` (Clear, concise summary).
*   `categories`: `["Linters", "Visualization"]` (Ensures placement in the appropriate marketplace groups).
*   `keywords`: `["spring-boot", "java", "architecture", "dependency-graph", "linter"]` (Covers high-frequency search keywords).

### 2.2 Package Size Optimization (`.vscodeignore`)
To keep the `.vsix` package lightweight and prevent packaging unnecessary development files, ensure the following `.vscodeignore` configuration is active:

```text
.github/**
docs/**
examples/**
scripts/**
test/**
src/**
.eslintrc.json
.gitignore
tsconfig.json
esbuild.js
package-lock.json
*.md
```

This configuration ensures only the compiled Javascript (`dist/`) and public visual assets are bundled into the VSIX, keeping package sizes small and installation quick.
