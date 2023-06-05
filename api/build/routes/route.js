"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const db_1 = require("../db");
const graph_1 = require("../graph");
const pool_1 = require("../pool");
const route = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = pool_1.poolInstance.getPool();
    const { start_address, end_address } = req.query;
    if (!start_address || !end_address) {
        res.status(400).send("Missing start_address or end_address");
        return;
    }
    try {
        const rows = yield (0, db_1.centreline)(pool, start_address, end_address);
        const graph = new graph_1.RouteGraph(rows);
        const directions = graph.getDirections();
        return res.status(200).json({ directions });
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message);
        return;
    }
});
exports.route = route;
