import Graph from "node-dijkstra";
import { Direction, Relative } from "../direction";
import { Edge, EdgeArgs } from "./edge";

export class RouteGraph {
  street_weights: Record<string, Record<string, number>>;
  edges: Record<string, Record<string, Edge>>;
  route: Graph;

  constructor(rows: EdgeArgs[] = [], safetyLevel: number) {
    this.street_weights = {};
    this.edges = {};
    rows.forEach((row: EdgeArgs) => {
      const { a_intersection, b_intersection } = row;
      const newEdge = new Edge(row);
      const weighted_length = newEdge.calculateWeightedLength(safetyLevel);
      if (a_intersection in this.street_weights) {
        this.street_weights[a_intersection][b_intersection] = weighted_length;
        this.edges[a_intersection][b_intersection] = newEdge;
      } else {
        this.street_weights[a_intersection] = {
          [b_intersection]: weighted_length,
        };
        this.edges[a_intersection] = {
          [b_intersection]: newEdge,
        };
      }
    });
    this.route = new Graph(this.street_weights);
  }

  getPath(start: string, end: string): Edge[] {
    const path = this.route.path(start, end) as string[];
    if (path) {
      const edges: Edge[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        edges.push(this.edges[a][b]);
      }
      return edges;
    }
    throw new Error(
      "Couldn't find a route. Make sure your addresses are valid."
    );
  }

  getDirections(): Direction[] {
    const path = this.getPath("CURRENT-POSITION", "ENDING-POSITION");
    const directions: Direction[] = [];
    let distance = 0;
    path.forEach((edge: Edge, i: number) => {
      if (i > 1) {
        const prev = path[i - 1];
        const relativeDirection = prev.relativeDirection(edge);
        if (
          relativeDirection === Relative.FORWARD ||
          prev.street_name === edge.street_name
        ) {
          directions.push(new Direction(edge, Relative.FORWARD));
        } else {
          directions.push(new Direction(edge, relativeDirection));
        }
        distance += edge.length;
      }
    });
    return directions;
  }
}
