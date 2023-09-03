"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Relative = void 0;
var Relative;
(function (Relative) {
    Relative["LEFT"] = "LEFT";
    Relative["RIGHT"] = "RIGHT";
    Relative["FORWARD"] = "FORWARD";
    Relative["BACKWARD"] = "BACKWARD";
})(Relative = exports.Relative || (exports.Relative = {}));
class Direction {
    constructor(edge, relative) {
        this.relative = relative;
        this.edge = edge;
    }
}
exports.Direction = Direction;
