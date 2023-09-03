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
exports.baseLayer = void 0;
const db_1 = require("./db");
const baseLayer = (lat, long, km = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows, _result] = yield db_1.db.query(`with 
      streets as 
        (select 
          'streets' as type, 
          geometry,
          jsonb_build_object() p 
        from centreline),
      blocks as 
        (select 
          'blocks' as type, 
          geometry, 
          jsonb_build_object() p 
        from blocks),
      parks as 
        (select 
          'parks' as type, 
          geometry, 
          jsonb_build_object('name', name) p 
        from greenspaces),
      layers as 
        (select * from streets union select * from blocks union select * from parks)
      select type, jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(jsonb_build_object('type', 'Feature',  'geometry', ST_AsGeoJSON(geometry)::json, 'properties', p))
      ) features from layers where st_intersects(st_buffer(ST_SetSRID(ST_MakePoint(${long}, ${lat}),4326)::geography, ${km * 1000})::geometry, geometry) group by type`);
    let response = {};
    rows.forEach((row) => {
        response[row.type] = row.features;
    });
    return response;
});
exports.baseLayer = baseLayer;
