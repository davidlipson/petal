import { Pool } from "pg";

export const baseLayer = async (
  pool: Pool,
  lat: number,
  long: number,
  km = 1
) => {
  const results = await pool.query(
    `with streets as (select 'streets' as type, geom, jsonb_build_object('street_type', field_35, 'street_name', field_4) p from centreline c where field_35 in (201200, 201500, 201300, 201700, 203002, 203001, 203002, 204002, 202001, 202002, 201100, 201801)),
      parks as (select 'parks' as type, geom, jsonb_build_object('name', name) p from parks),
      signals as (select 'signals' as type, geom, jsonb_build_object() p from signals),
      prp as (select 'properties' as type, geom, jsonb_build_object('f_type', f_type) p from property where f_type in ('COMMON', 'CONDO')),
      layers as (select * from streets union select * from prp union select * from parks union select * from signals)
      select type, jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(jsonb_build_object('type', 'Feature',  'geometry', ST_AsGeoJSON(geom)::json, 'properties', p))
    ) features from layers where st_contains(st_buffer(ST_SetSRID(ST_MakePoint(${long}, ${lat}),4326)::geography, ${
      km * 1000
    })::geometry, geom) group by type`
  );

  let response = {} as Record<string, JSON>;
  results.rows.forEach((row) => {
    response[row.type] = row.features;
  });
  return response;
};
