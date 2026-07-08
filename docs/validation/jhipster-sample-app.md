=====================================
CodeAtlas Validation Report: jhipster-sample-app
=====================================
Total Java Files: 136
Components Discovered: 136
Relationships Discovered: 318
Rule Violations: 8
Parser Failures: 0

### Parser Failures
None

### Unsupported Constructs Encountered
*Note: Currently inferred from parser failures and known limitations.*
None explicitly caught during this run.

### Rule Violations Sample (Top 50)
- **BYPASS_SERVICE**: Controller 'AccountResourceException' directly depends on Repository 'UserRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.AccountResourceException, io.github.jhipster.sample.repository.UserRepository)
- **BYPASS_SERVICE**: Controller 'AuthorityResource' directly depends on Repository 'AuthorityRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.AuthorityResource, io.github.jhipster.sample.repository.AuthorityRepository)
- **BYPASS_SERVICE**: Controller 'BankAccountResource' directly depends on Repository 'BankAccountRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.BankAccountResource, io.github.jhipster.sample.repository.BankAccountRepository)
- **BYPASS_SERVICE**: Controller 'LabelResource' directly depends on Repository 'LabelRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.LabelResource, io.github.jhipster.sample.repository.LabelRepository)
- **BYPASS_SERVICE**: Controller 'OperationResource' directly depends on Repository 'OperationRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.OperationResource, io.github.jhipster.sample.repository.OperationRepository)
- **BYPASS_SERVICE**: Controller 'UserResource' directly depends on Repository 'UserRepository'. Introduce a Service layer. (Nodes: io.github.jhipster.sample.web.rest.UserResource, io.github.jhipster.sample.repository.UserRepository)
- **CIRCULAR_DEPENDENCY**: Circular dependency detected:
BankAccount
→ Operation
→ BankAccount (Nodes: io.github.jhipster.sample.domain.BankAccount, io.github.jhipster.sample.domain.Operation)
- **CIRCULAR_DEPENDENCY**: Circular dependency detected:
Operation
→ Label
→ Operation (Nodes: io.github.jhipster.sample.domain.Operation, io.github.jhipster.sample.domain.Label)
