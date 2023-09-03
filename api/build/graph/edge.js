"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edge = void 0;
const direction_1 = require("../direction");
class Edge {
    constructor(args) {
        const { street_name, departing_angle, arriving_angle, geometry, a_intersection, b_intersection, length, fcode, a_geometry, b_geometry, } = args;
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
    calculateWeightedLength(safetyLevel) {
        return this.length; // change with weighted scores
    }
    relativeDirection(previous) {
        const diff = this.departing_angle - previous.arriving_angle;
        if (diff < 0) {
            return direction_1.Relative.LEFT;
        }
        else if (diff > 0) {
            return direction_1.Relative.RIGHT;
        }
        else {
            return direction_1.Relative.FORWARD;
        }
    }
}
exports.Edge = Edge;
