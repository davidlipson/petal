"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteGraph = void 0;
const node_dijkstra_1 = __importDefault(require("node-dijkstra"));
const weights_1 = require("./weights");
const direction_1 = require("../direction");
const edge_1 = require("./edge");
class RouteGraph {
    constructor(rows = []) {
        this.street_weights = {};
        this.edges = {};
        rows.forEach((row) => {
            const { a_name, b_name, a_geometry, b_geometry, street_length, road_type, street_name, departing_angle, arriving_angle, geometry, } = row;
            const weighted_length = street_length * weights_1.WEIGHTS[road_type];
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
                weighted_length,
            });
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
        throw new Error("No path found");
    }
    getDirections() {
        const path = this.getPath("START-TERMINUS", "END-TERMINUS");
        const directions = [];
        path.forEach((edge, i) => {
            const ord = edge.ordinalDirection();
            if (i === 0) {
                directions.push(new direction_1.Direction(`GO ${edge.ordinalDirection()} on ${edge.street_name}`, edge, ord, direction_1.Relative.FORWARD));
            }
            else {
                const prev = path[i - 1];
                const relativeDirection = prev.relativeDirection(edge);
                if (relativeDirection === direction_1.Relative.FORWARD ||
                    prev.street_name === edge.street_name) {
                    directions.push(new direction_1.Direction(`CONTINUE on ${edge.street_name}`, edge, ord, direction_1.Relative.FORWARD));
                }
                else {
                    directions.push(new direction_1.Direction(`TURN ${relativeDirection} onto ${edge.street_name}`, edge, ord, relativeDirection));
                }
            }
        });
        return directions;
    }
}
exports.RouteGraph = RouteGraph;
