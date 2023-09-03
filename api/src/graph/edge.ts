import { Relative } from "../direction";

export interface EdgeArgs {
  a_intersection: string;
  b_intersection: string;
  a_geometry: string;
  b_geometry: string;
  length: number;
  fcode: number;
  street_name: string;
  departing_angle: number; // angle leaving a node
  arriving_angle: number; // angle arriving at b node
  geometry: string;
}

export class Edge {
  a_intersection: string;
  b_intersection: string;
  a_geometry: JSON;
  b_geometry: JSON;
  length: number;
  street_name: string;
  departing_angle: number; // angle leaving a node
  arriving_angle: number; // angle arriving at b node
  geometry: JSON;
  fcode: number;

  constructor(args: EdgeArgs) {
    const {
      street_name,
      departing_angle,
      arriving_angle,
      geometry,
      a_intersection,
      b_intersection,
      length,
      fcode,
      a_geometry,
      b_geometry,
    } = args;

    this.street_name = street_name;
    this.departing_angle = departing_angle;
    this.arriving_angle = arriving_angle;
    this.geometry = JSON.parse(geometry);
    this.a_intersection = a_intersection;
    this.b_intersection = b_intersection;
    this.length = length;
    this.a_geometry = JSON.parse(a_geometry);
    this.b_geometry = JSON.parse(b_geometry);
    this.fcode = fcode;
  }

  calculateWeightedLength(safetyLevel: number): number {
    return this.length; // change with weighted scores
  }

  relativeDirection(previous: Edge): Relative {
    const diff = this.departing_angle - previous.arriving_angle;
    if (diff < 0) {
      return Relative.LEFT;
    } else if (diff > 0) {
      return Relative.RIGHT;
    } else {
      return Relative.FORWARD;
    }
  }
}
