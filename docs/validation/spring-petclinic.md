=====================================
CodeAtlas Validation Report: spring-petclinic
=====================================
Total Java Files: 48
Components Discovered: 48
- Controllers: 6
- Services: 0
- Repositories: 3
- Entities: 9
Relationships Discovered: 96

Rule Violations: 5
- Layer Violations: 5
- Circular Dependencies: 0
- Unused Services: 0

Architecture Health: 50/100

Parser Failures: 0

### Parser Failures
None

### Unsupported Constructs Encountered
None explicitly caught during this run.

### Rule Violations Sample (Top 50)
- **BYPASS_SERVICE**: Controller 'OwnerController' directly depends on Repository 'OwnerRepository'. Introduce a Service layer. (Nodes: org.springframework.samples.petclinic.owner.OwnerController, org.springframework.samples.petclinic.owner.OwnerRepository)
- **BYPASS_SERVICE**: Controller 'PetController' directly depends on Repository 'OwnerRepository'. Introduce a Service layer. (Nodes: org.springframework.samples.petclinic.owner.PetController, org.springframework.samples.petclinic.owner.OwnerRepository)
- **BYPASS_SERVICE**: Controller 'PetController' directly depends on Repository 'PetTypeRepository'. Introduce a Service layer. (Nodes: org.springframework.samples.petclinic.owner.PetController, org.springframework.samples.petclinic.owner.PetTypeRepository)
- **BYPASS_SERVICE**: Controller 'VisitController' directly depends on Repository 'OwnerRepository'. Introduce a Service layer. (Nodes: org.springframework.samples.petclinic.owner.VisitController, org.springframework.samples.petclinic.owner.OwnerRepository)
- **BYPASS_SERVICE**: Controller 'VetController' directly depends on Repository 'VetRepository'. Introduce a Service layer. (Nodes: org.springframework.samples.petclinic.vet.VetController, org.springframework.samples.petclinic.vet.VetRepository)
