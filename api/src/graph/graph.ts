import Graph from "node-dijkstra";
import { Adjacency } from "../model";
import { Direction, Relative } from "../direction";
import { Edge } from "./edge";

export class RouteGraph {
  street_weights: Record<string, Record<string, number>>;
  edges: Record<string, Record<string, Edge>>;
  route: Graph;

  constructor(rows: Adjacency[] = [], safetyLevel: number) {
    this.street_weights = {};
    this.edges = {};
    rows.forEach((row: Adjacency) => {
      const {
        a_name,
        b_name,
        a_geometry,
        b_geometry,
        street_length,
        road_type,
        street_name,
        departing_angle,
        arriving_angle,
        geometry,
        bike_lanes,
      } = row;
      const newEdge = new Edge({
        street_name,
        departing_angle,
        arriving_angle,
        a_geometry: JSON.parse(a_geometry),
        b_geometry: JSON.parse(b_geometry),
        geometry: JSON.parse(geometry),
        a_name,
        b_name,
        street_length,
        road_type,
        bike_lanes,
      });
      const weighted_length = newEdge.calculateWeightedLength(safetyLevel);
      if (a_name in this.street_weights) {
        this.street_weights[a_name][b_name] = weighted_length;
        this.edges[a_name][b_name] = newEdge;
      } else {
        this.street_weights[a_name] = { [b_name]: weighted_length };
        this.edges[a_name] = {
          [b_name]: newEdge,
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
    throw new Error("Couldn't find a route. Make sure your addresses are valid.");
  }

  getDirections(): Direction[] {
    const path = this.getPath("CURRENT-POSITION", "ENDING-POSITION");
    const directions: Direction[] = [];
    let distance = 0;
    path.forEach((edge: Edge, i: number) => {
      if (i > 1) {
        const ord = edge.ordinalDirection();

        const prev = path[i - 1];
        const relativeDirection = prev.relativeDirection(edge);
        if (
          relativeDirection === Relative.FORWARD ||
          prev.street_name === edge.street_name
        ) {
          directions.push(new Direction(edge, ord, Relative.FORWARD));
        } else {
          directions.push(new Direction(edge, ord, relativeDirection));
        }

        distance += edge.street_length;
        if (edge.street_name !== path[i - 1].street_name) {
          console.log(edge.cardinalDirection(), edge.street_name);
        }
      }
    });
    return directions;
  }
}
