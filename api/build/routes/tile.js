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
exports.tile = void 0;
const pool_1 = require("../pool");
const tile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = pool_1.poolInstance.getPool();
    const { lat1, long1, lat2, long2 } = req.query;
    console.log(lat1, long1, lat2, long2, req.query);
    if (!lat1 || !long1 || !lat2 || !long2) {
        res.status(400).send("Missing lat long coordinates");
        return;
    }
    try {
        console.log(`select st_asmvt(q, 'internal-layer-name', 4096, 'geom') tile
    from (select st_asmvtgeom(geom, ST_MakeEnvelope(${long1}, ${lat1}, ${long2}, ${lat2}, 4326), 4096, 0, false) geom from centreline c) q`);
        const result = yield pool.query(`select st_asmvt(q, 'internal-layer-name', 4096, 'geom') tile
        from (select st_asmvtgeom(geom, ST_MakeEnvelope(${long1}, ${lat1}, ${long2}, ${lat2}, 4326), 4096, 0, false) geom from centreline c) q`);
        console.log(result);
        if (result.rows.length == 0) {
            res.status(400).send("No data found");
            return;
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message);
        return;
    }
});
exports.tile = tile;
