import { db } from "./db";

export const baseLayer = async (lat: number, long: number, km = 1) => {
  const [rows, _result] = await db.query(
    `with 
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
      ) features from layers where st_intersects(st_buffer(ST_SetSRID(ST_MakePoint(${long}, ${lat}),4326)::geography, ${
      km * 1000
    })::geometry, geometry) group by type`
  );

  let response = {} as Record<string, JSON>;
  rows.forEach((row: any) => {
    response[row.type] = row.features;
  });

  return response;
};
