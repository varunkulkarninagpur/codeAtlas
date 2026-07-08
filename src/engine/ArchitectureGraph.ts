import { JavaClass, DependencyReference, RelationshipType, EdgeQuery } from "../common/types";

/**
 * Stores the data for a single directed edge in the architecture graph.
 */
interface EdgeData {
  reference: DependencyReference;
  relType: RelationshipType;
}

/**
 * ArchitectureGraph represents an in-memory directed graph storing components and their
 * relationships. Every edge carries a RelationshipType so that analysis rules can filter
 * to only the relationships that are semantically meaningful to them.
 *
 * Graph queries accept an optional EdgeQuery for filtering. This is the single extensibility
 * point for all query variations — new filter dimensions can be added to EdgeQuery without
 * changing any method signatures on the graph.
 */
export class ArchitectureGraph {
  private nodes: Map<string, JavaClass> = new Map();
  /** outgoing.get(sourceId).get(targetId) = EdgeData */
  private outgoing: Map<string, Map<string, EdgeData>> = new Map();
  /** incoming.get(targetId) = Set<sourceId> — source list for quick lookup */
  private incoming: Map<string, Set<string>> = new Map();

  /**
   * Adds a JavaClass component to the graph.
   */
  public addComponent(component: JavaClass): void {
    const id = component.fullyQualifiedName;
    this.nodes.set(id, component);
    if (!this.outgoing.has(id)) {
      this.outgoing.set(id, new Map());
    }
    if (!this.incoming.has(id)) {
      this.incoming.set(id, new Set());
    }
  }

  /**
   * Connects two components with a typed directed edge (source → target).
   * @param sourceId Fully qualified name of the source component.
   * @param targetId Fully qualified name of the target component.
   * @param relType Semantic type of this relationship.
   */
  public connect(
    sourceId: string,
    targetId: string,
    relType: RelationshipType = RelationshipType.DEPENDENCY,
  ): void {
    const sourceNode = this.nodes.get(sourceId);
    const targetNode = this.nodes.get(targetId);

    if (sourceNode && targetNode) {
      const depRef = sourceNode.dependencies.find((d) => d.className === targetNode.className);

      const defaultLocation = {
        filePath: sourceNode.filePath,
        line: 1,
        column: 1,
      };

      const reference: DependencyReference = depRef ?? {
        className: targetNode.className,
        relationshipType: relType,
        location: defaultLocation,
      };

      if (!this.outgoing.has(sourceId)) {
        this.outgoing.set(sourceId, new Map());
      }
      this.outgoing.get(sourceId)!.set(targetId, { reference, relType });

      if (!this.incoming.has(targetId)) {
        this.incoming.set(targetId, new Set());
      }
      this.incoming.get(targetId)!.add(sourceId);
    }
  }

  /**
   * Gets a component by its identifier.
   */
  public getComponent(id: string): JavaClass | undefined {
    return this.nodes.get(id);
  }

  /**
   * Returns the relationship type of a specific edge, or undefined if no edge exists.
   */
  public getEdgeType(sourceId: string, targetId: string): RelationshipType | undefined {
    return this.outgoing.get(sourceId)?.get(targetId)?.relType;
  }

  /**
   * Gets the DependencyReference for a specific connection.
   */
  public getConnectionReference(sourceId: string, targetId: string): DependencyReference | undefined {
    return this.outgoing.get(sourceId)?.get(targetId)?.reference;
  }

  /**
   * Gets outgoing target IDs for a component, optionally filtered by an EdgeQuery.
   * When no query is supplied, all edges are returned (backward compatible).
   *
   * @param id Fully qualified name of the source component.
   * @param query Optional filter. If query.types is set, only edges of those types are included.
   */
  public getOutgoing(id: string, query?: EdgeQuery): string[] {
    const edgeMap = this.outgoing.get(id);
    if (!edgeMap) return [];

    if (!query?.types) {
      return Array.from(edgeMap.keys());
    }

    const allowed = new Set(query.types);
    return Array.from(edgeMap.entries())
      .filter(([, data]) => allowed.has(data.relType))
      .map(([targetId]) => targetId);
  }

  /**
   * Gets incoming source IDs for a component, optionally filtered by an EdgeQuery.
   * When no query is supplied, all sources are returned (backward compatible).
   *
   * @param id Fully qualified name of the target component.
   * @param query Optional filter. If query.types is set, only edges of those types are included.
   */
  public getIncoming(id: string, query?: EdgeQuery): string[] {
    const sources = this.incoming.get(id);
    if (!sources) return [];

    if (!query?.types) {
      return Array.from(sources);
    }

    const allowed = new Set(query.types);
    return Array.from(sources).filter((sourceId) => {
      const edgeData = this.outgoing.get(sourceId)?.get(id);
      return edgeData && allowed.has(edgeData.relType);
    });
  }

  /**
   * Gets all components stored in the graph.
   */
  public getAllComponents(): JavaClass[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Generic cycle detection algorithm. Accepts an optional EdgeQuery to restrict which
   * edges are traversed during DFS. This is the single cycle-detection implementation
   * in the codebase — the EdgeQuery handles all type-filtering needs.
   *
   * @param query Optional filter. If query.types is set, only edges of those types are traversed.
   * @returns Array of cycles, where each cycle is an array of fully qualified names.
   */
  public findCycles(query?: EdgeQuery): string[][] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];
    const cycles: string[][] = [];

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const targets = this.getOutgoing(nodeId, query);
      for (const target of targets) {
        if (recStack.has(target)) {
          const startIndex = path.indexOf(target);
          if (startIndex !== -1) {
            cycles.push(path.slice(startIndex));
          }
        } else if (!visited.has(target)) {
          dfs(target);
        }
      }

      recStack.delete(nodeId);
      path.pop();
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    }

    return cycles;
  }
}
