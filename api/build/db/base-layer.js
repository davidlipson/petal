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
const baseLayer = (pool, lat, long, km = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield pool.query(`with streets as (select 'streets' as type, geom, jsonb_build_object('street_type', field_35, 'street_name', field_4) p from centreline c where field_35 in (201200, 201500, 201300, 201700, 203002, 203001, 203002, 204002, 202001, 202002, 201100, 201801)),
      parks as (select 'parks' as type, geom, jsonb_build_object('name', name) p from parks),
      edge as (select 'edge' as type, geom, jsonb_build_object() p from road_edge),
      signals as (select 'signals' as type, geom, jsonb_build_object() p from signals),
      bikelanes as (select 'bikelanes' as type, geom, jsonb_build_object('cp_type', cp_type) p from biking_edges),
      prp as (select 'properties' as type, geom, jsonb_build_object('f_type', f_type) p from property where f_type in ('COMMON', 'CONDO')),
      layers as (select * from streets union select * from prp union select * from parks union select * from signals union select * from bikelanes union select * from edge)
      select type, jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(jsonb_build_object('type', 'Feature',  'geometry', ST_AsGeoJSON(geom)::json, 'properties', p))
    ) features from layers where st_intersects(st_buffer(ST_SetSRID(ST_MakePoint(${long}, ${lat}),4326)::geography, ${km * 1000})::geometry, geom) group by type`);
    let response = {};
    results.rows.forEach((row) => {
        response[row.type] = row.features;
    });
    return response;
});
exports.baseLayer = baseLayer;
