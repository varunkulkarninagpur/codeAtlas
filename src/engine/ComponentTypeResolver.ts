import { JavaClass } from "../common/types";

export class ComponentTypeResolver {
  private readonly SPRING_DATA_REPOSITORIES = new Set([
    "Repository",
    "CrudRepository",
    "PagingAndSortingRepository",
    "JpaRepository",
    "MongoRepository",
    "ReactiveCrudRepository",
    "R2dbcRepository",
    "ReactiveMongoRepository",
  ]);

  /**
   * Resolves indirect inheritance chains to accurately classify components.
   * @param classes The list of all extracted Java classes.
   */
  public resolve(classes: JavaClass[]): void {
    const classMap = new Map<string, JavaClass>();
    for (const c of classes) {
      classMap.set(c.fullyQualifiedName, c);
    }

    const isRepositoryCache = new Map<string, boolean>();

    const checkIsRepository = (fqn: string, visited: Set<string>): boolean => {
      if (isRepositoryCache.has(fqn)) {
        return isRepositoryCache.get(fqn)!;
      }
      if (visited.has(fqn)) {
        return false; // Break circular inheritance
      }
      visited.add(fqn);

      const javaClass = classMap.get(fqn);
      if (!javaClass) {
        return false;
      }

      // If it's already explicitly marked as a REPOSITORY, return true
      if (javaClass.type === "REPOSITORY") {
        isRepositoryCache.set(fqn, true);
        return true;
      }

      for (const baseType of javaClass.baseTypes) {
        if (this.SPRING_DATA_REPOSITORIES.has(baseType)) {
          isRepositoryCache.set(fqn, true);
          return true;
        }

        const resolvedFqn = this.resolveFqName(javaClass, baseType, classes);
        if (resolvedFqn) {
          if (checkIsRepository(resolvedFqn, visited)) {
            isRepositoryCache.set(fqn, true);
            return true;
          }
        }
      }

      isRepositoryCache.set(fqn, false);
      return false;
    };

    for (const javaClass of classes) {
      if (javaClass.type !== "REPOSITORY") {
        if (checkIsRepository(javaClass.fullyQualifiedName, new Set())) {
          javaClass.type = "REPOSITORY";
        }
      }
    }
  }

  private resolveFqName(sourceClass: JavaClass, typeName: string, allClassList: JavaClass[]): string | null {
    const explicitImport = sourceClass.imports.find((imp) => imp.endsWith(`.${typeName}`));
    if (explicitImport) {
      return explicitImport;
    }
    const samePackageFqName = sourceClass.packageName ? `${sourceClass.packageName}.${typeName}` : typeName;
    const existsInSamePackage = allClassList.some((c) => c.fullyQualifiedName === samePackageFqName);
    if (existsInSamePackage) {
      return samePackageFqName;
    }
    const matchingClass = allClassList.find((c) => c.className === typeName);
    if (matchingClass) {
      return matchingClass.fullyQualifiedName;
    }
    return null;
  }
}
