"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteGraph = void 0;
const node_dijkstra_1 = __importDefault(require("node-dijkstra"));
const direction_1 = require("../direction");
const edge_1 = require("./edge");
class RouteGraph {
    constructor(rows = [], safetyLevel) {
        this.street_weights = {};
        this.edges = {};
        rows.forEach((row) => {
            const { a_name, b_name, a_geometry, b_geometry, street_length, road_type, street_name, departing_angle, arriving_angle, geometry, bike_lanes, } = row;
            const newEdge = new edge_1.Edge({
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
            }
            else {
                this.street_weights[a_name] = { [b_name]: weighted_length };
                this.edges[a_name] = {
                    [b_name]: newEdge,
                };
            }
        });
        this.route = new node_dijkstra_1.default(this.street_weights);
    }
    getPath(start, end) {
        const path = this.route.path(start, end);
        if (path) {
            const edges = [];
            for (let i = 0; i < path.length - 1; i++) {
                const a = path[i];
                const b = path[i + 1];
                edges.push(this.edges[a][b]);
            }
            return edges;
        }
        throw new Error("Couldn't find a route. Make sure your addresses are valid.");
    }
    getDirections() {
        const path = this.getPath("CURRENT-POSITION", "ENDING-POSITION");
        const directions = [];
        let distance = 0;
        path.forEach((edge, i) => {
            if (i > 1) {
                const ord = edge.ordinalDirection();
                const prev = path[i - 1];
                const relativeDirection = prev.relativeDirection(edge);
                if (relativeDirection === direction_1.Relative.FORWARD ||
                    prev.street_name === edge.street_name) {
                    directions.push(new direction_1.Direction(edge, ord, direction_1.Relative.FORWARD));
                }
                else {
                    directions.push(new direction_1.Direction(edge, ord, relativeDirection));
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
exports.RouteGraph = RouteGraph;
