=====================================
CodeAtlas Validation Report: spring-boot-realworld-example-app
=====================================
Total Java Files: 116
Components Discovered: 116
Relationships Discovered: 283
Rule Violations: 2
Parser Failures: 0

### Parser Failures
None

### Unsupported Constructs Encountered
*Note: Currently inferred from parser failures and known limitations.*
None explicitly caught during this run.

### Rule Violations Sample (Top 50)
- **BYPASS_SERVICE**: Controller 'ProfileApi' directly depends on Repository 'UserRepository'. Introduce a Service layer. (Nodes: io.spring.api.ProfileApi, io.spring.core.user.UserRepository)
- **BYPASS_SERVICE**: Controller 'LoginParam' directly depends on Repository 'UserRepository'. Introduce a Service layer. (Nodes: io.spring.api.LoginParam, io.spring.core.user.UserRepository)
