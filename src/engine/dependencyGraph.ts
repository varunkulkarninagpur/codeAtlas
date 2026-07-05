// TODO: Implement dependency graph to track classes and their connections

import { GraphNode, GraphEdge } from "../common/types";

export class DependencyGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  public getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): GraphEdge[] {
    return this.edges;
  }
}
