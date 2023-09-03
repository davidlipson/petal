import { Edge } from "../graph";

export enum Relative {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export class Direction {
  edge: Edge;
  relative: Relative;
  constructor(edge: Edge, relative: Relative) {
    this.relative = relative;
    this.edge = edge;
  }
}
