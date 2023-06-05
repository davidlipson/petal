import { Cardinal, Relative } from "../direction";

export interface EdgeParams {
  street_name: string;
  departing_angle: number;
  arriving_angle: number;
  geometry: JSON;
  a_name: string;
  b_name: string;
  a_geometry: JSON;
  b_geometry: JSON;
  street_length: number;
  road_type: number;
  weighted_length: number;
}

export class Edge {
  a_name: string;
  b_name: string;
  a_geometry: JSON;
  b_geometry: JSON;
  street_length: number;
  road_type: number;
  street_name: string;
  departing_angle: number; // angle leaving a node
  arriving_angle: number; // angle arriving at b node
  geometry: JSON;
  weighted_length: number;
  constructor(args: EdgeParams) {
    const {
      street_name,
      departing_angle,
      arriving_angle,
      geometry,
      a_name,
      b_name,
      street_length,
      road_type,
      weighted_length,
      a_geometry,
      b_geometry,
    } = args;

    this.street_name = street_name;
    this.departing_angle = departing_angle;
    this.arriving_angle = arriving_angle;
    this.geometry = geometry;
    this.a_name = a_name;
    this.b_name = b_name;
    this.street_length = street_length;
    this.road_type = road_type;
    this.weighted_length = weighted_length;
    this.a_geometry = a_geometry;
    this.b_geometry = b_geometry;
  }
  cardinalDirection(): Cardinal {
    if (this.departing_angle <= 45 || this.departing_angle > 315) {
      return Cardinal.N;
    } else if (this.departing_angle <= 135) {
      return Cardinal.E;
    } else if (this.departing_angle <= 225) {
      return Cardinal.S;
    } else {
      return Cardinal.W;
    }
  }
  ordinalDirection(): Cardinal {
    if (this.departing_angle <= 22.5 || this.departing_angle > 337.5) {
      return Cardinal.N;
    } else if (this.departing_angle <= 67.5) {
      return Cardinal.NE;
    } else if (this.departing_angle <= 112.5) {
      return Cardinal.E;
    } else if (this.departing_angle <= 157.5) {
      return Cardinal.SE;
    } else if (this.departing_angle <= 202.5) {
      return Cardinal.S;
    } else if (this.departing_angle <= 247.5) {
      return Cardinal.SW;
    } else if (this.departing_angle <= 292.5) {
      return Cardinal.W;
    } else {
      return Cardinal.NW;
    }
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
