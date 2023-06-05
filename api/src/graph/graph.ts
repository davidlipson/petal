import Graph from "node-dijkstra";
import { Adjacency } from "../model";
import { WEIGHTS } from "./weights";
import { Direction, Relative } from "../direction";
import { Edge } from "./edge";

export class RouteGraph {
  street_weights: Record<string, Record<string, number>>;
  edges: Record<string, Record<string, Edge>>;
  route: Graph;

  constructor(rows: Adjacency[] = []) {
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
      } = row;
      const weighted_length = street_length * WEIGHTS[road_type];
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
        weighted_length,
      });
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
    throw new Error("No path found");
  }

  getDirections(): Direction[] {
    const path = this.getPath("START-TERMINUS", "END-TERMINUS");
    /*
     const direction = this.props.directions[this.props.step];
    const nextDirection = this.props.directions[this.props.step + 1];
    const isSecondLastStep =
      this.props.step === this.props.directions.length - 2;
    const isLastStep = this.props.step === this.props.directions.length - 1;
    const isFirstStep = this.props.step === 0;
    const isForward = nextDirection.relative === "FORWARD";
    return (
      <div id="route-info">
        <div className="route-info-header">
          {isLastStep
            ? "You have ARRIVED"
            : isSecondLastStep
            ? `You will ARRIVE IN ${this.toMeters(
                direction.edge.street_length
              )}`
            : isFirstStep || isForward
            ? `GO ${direction.cardinality} on ${
                direction.edge.street_name
              } for ${this.toMeters(direction.edge.street_length)}`
            : `IN ${this.toMeters(direction.edge.street_length)} ${
                nextDirection.directive
              }`}
        </div>
      </div>*/

      // FIX

    const directions: Direction[] = [];
    path.forEach((edge: Edge, i: number) => {
      let directive = "";
      let relativeDirection = Relative.FORWARD;
      let ord = edge.ordinalDirection();
      if(i === path.length - 1) {
      }

      else{
        
      }
      
      if (i === 0) {
        directive = `HEAD ${edge.ordinalDirection()} on ${
          edge.street_name
        } and ${directive}`;
      }


      if (i === 0) {
        directive = `HEAD ${edge.ordinalDirection()} on ${
          edge.street_name
        } and ${directive}`;
      }

      directions.push(
        new Direction(
          directive,
          edge,
          ord,
          relativeDirection
        )
      );
    });

    return directions;
  }
}
