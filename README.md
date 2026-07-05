# CodeAtlas

An offline, zero-telemetry static analysis extension for VS Code that validates Spring Boot architectures on demand.

## Features

- **Architecture Health Score**: Evaluates your codebase from 0 to 100 based on standard architecture violations.
- **Component Breakdown**: View counts of Controllers, Services, Repositories, and Entities.
- **Rules Verified**:
  - **Service Bypass**: Ensures Controllers never directly call Repositories.
  - **Cycle Detection**: Flags circular dependencies within your project.
  - **Unused Services**: Highlights services that have no referencing components.
- **Zero Cloud/AI**: Runs completely locally inside your VS Code extension host.

## Usage

1. Open your Spring Boot / Java project in VS Code.
2. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).
3. Select **CodeAtlas: Analyze Project**.
4. View violations in the **Problems** tab or check the **CodeAtlas Sidebar View**.

## License

[MIT](LICENSE)
