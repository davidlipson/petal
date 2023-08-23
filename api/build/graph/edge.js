"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edge = void 0;
const direction_1 = require("../direction");
const road_types_1 = require("./road-types");
const weights_1 = require("./weights");
class Edge {
    constructor(args) {
        const { street_name, departing_angle, arriving_angle, geometry, a_name, b_name, street_length, road_type, a_geometry, b_geometry, bike_lanes, } = args;
        this.street_name = street_name;
        this.departing_angle = departing_angle;
        this.arriving_angle = arriving_angle;
        this.geometry = geometry;
        this.a_name = a_name;
        this.b_name = b_name;
        this.street_length = street_length;
        this.road = { id: road_type, name: road_types_1.ROAD_TYPE[road_type] };
        this.a_geometry = a_geometry;
        this.b_geometry = b_geometry;
        this.bike_lanes = bike_lanes;
    }
    calculateWeightedLength(safetyLevel) {
        if (safetyLevel >= 4) {
            return this.safeEdge();
        }
        return this.street_length;
    }
    safeEdge() {
        let factor = weights_1.WEIGHTS[this.road.id];
        if (this.bike_lanes.length > 0) {
            factor = factor * 0.5;
        }
        return this.street_length * factor;
    }
    cardinalDirection() {
        if (this.departing_angle <= 45 || this.departing_angle > 315) {
            return direction_1.Cardinal.N;
        }
        else if (this.departing_angle <= 135) {
            return direction_1.Cardinal.E;
        }
        else if (this.departing_angle <= 225) {
            return direction_1.Cardinal.S;
        }
        else {
            return direction_1.Cardinal.W;
        }
    }
    ordinalDirection() {
        if (this.departing_angle <= 22.5 || this.departing_angle > 337.5) {
            return direction_1.Cardinal.N;
        }
        else if (this.departing_angle <= 67.5) {
            return direction_1.Cardinal.NE;
        }
        else if (this.departing_angle <= 112.5) {
            return direction_1.Cardinal.E;
        }
        else if (this.departing_angle <= 157.5) {
            return direction_1.Cardinal.SE;
        }
        else if (this.departing_angle <= 202.5) {
            return direction_1.Cardinal.S;
        }
        else if (this.departing_angle <= 247.5) {
            return direction_1.Cardinal.SW;
        }
        else if (this.departing_angle <= 292.5) {
            return direction_1.Cardinal.W;
        }
        else {
            return direction_1.Cardinal.NW;
        }
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
