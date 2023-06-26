"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Relative = exports.Cardinal = void 0;
var Cardinal;
(function (Cardinal) {
    Cardinal["N"] = "N";
    Cardinal["E"] = "E";
    Cardinal["S"] = "S";
    Cardinal["W"] = "W";
    Cardinal["NE"] = "NE";
    Cardinal["SE"] = "SE";
    Cardinal["SW"] = "SW";
    Cardinal["NW"] = "NW";
})(Cardinal = exports.Cardinal || (exports.Cardinal = {}));
var Relative;
(function (Relative) {
    Relative["LEFT"] = "LEFT";
    Relative["RIGHT"] = "RIGHT";
    Relative["FORWARD"] = "FORWARD";
    Relative["BACKWARD"] = "BACKWARD";
})(Relative = exports.Relative || (exports.Relative = {}));
class Direction {
    constructor(edge, cardinality, relative) {
        this.cardinality = cardinality;
        this.relative = relative;
        this.edge = edge;
    }
}
exports.Direction = Direction;
