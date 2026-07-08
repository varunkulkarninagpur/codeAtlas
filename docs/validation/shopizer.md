=====================================
CodeAtlas Validation Report: shopizer
=====================================
Total Java Files: 1210
Components Discovered: 1210
- Controllers: 58
- Services: 98
- Repositories: 72
- Entities: 91
Relationships Discovered: 4780

Rule Violations: 3
- Layer Violations: 0
- Circular Dependencies: 1
- Unused Services: 2

Architecture Health: 75/100

Parser Failures: 0

### Parser Failures
None

### Unsupported Constructs Encountered
None explicitly caught during this run.

### Rule Violations Sample (Top 50)
- **CIRCULAR_DEPENDENCY**: Circular dependency detected:
Catalog
-> CatalogDescription
-> Catalog (Nodes: com.salesmanager.core.model.catalog.marketplace.Catalog, com.salesmanager.core.model.catalog.marketplace.CatalogDescription)
- **UNUSED_SERVICE**: Service 'OrderProductDownloadServiceImpl' is not referenced by any other component. (Nodes: com.salesmanager.core.business.services.order.orderproduct.OrderProductDownloadServiceImpl)
- **UNUSED_SERVICE**: Service 'SocialCustomerServicesImpl' is not referenced by any other component. (Nodes: com.salesmanager.shop.store.security.SocialCustomerServicesImpl)
