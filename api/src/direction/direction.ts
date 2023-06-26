import { Edge } from "../graph";

export enum Cardinal {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
  NE = "NE",
  SE = "SE",
  SW = "SW",
  NW = "NW",
}

export enum Relative {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export class Direction {
  edge: Edge;
  cardinality: Cardinal;
  relative: Relative;
  constructor(
    edge: Edge,
    cardinality: Cardinal,
    relative: Relative
  ) {
    this.cardinality = cardinality;
    this.relative = relative;
    this.edge = edge;
  }
}
