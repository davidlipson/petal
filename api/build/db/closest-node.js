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
exports.closestNode = void 0;
const closestNode = (pool, address) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query(`
    with start as 
      (select * from address a where concat(a.address, ' ', a.lfname) like '%${address}%' limit 1), 
    nodes as 
      (select a as geom, a_name as name from centreline_graph_v2 group by a, a_name)
    SELECT closest.name, st_asgeojson(start.geom) position
    FROM start start
    CROSS JOIN LATERAL (
      SELECT name, geom, geom <-> start.geom AS dist
      FROM nodes
      ORDER BY dist
      LIMIT 1
    ) closest;`);
    if (result.rows.length === 0) {
        throw new Error(`No address ${address} found.`);
    }
    return result.rows[0];
});
exports.closestNode = closestNode;
