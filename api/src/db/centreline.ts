import { Pool } from "pg";
import { WEIGHTS } from "../graph";

export const centreline = async (
  pool: Pool,
  start_address: string,
  end_address: string
) => {
  const road_types = Object.keys(WEIGHTS).filter((w) => WEIGHTS[parseInt(w)] > 0);
  const results = await pool.query(
    `with basic_graph as (select * from centreline_w_bikes_v2 cgv where road_type = ANY ($1)), 
    startadd as (select *, 'START-TERMINUS' node_name from address a where (concat(address, ' ', lfname) = $2)  limit 1),
      endadd as (select *, 'END-TERMINUS' node_name from address a where (concat(address, ' ', lfname) = $3) limit 1),
      nodes as 
        (select street_geom as geom, a_name, b_name from basic_graph group by street_geom, a_name, b_name),
    start_address_closest_street as (SELECT closest.*, startadd.geom start_point, startadd.node_name
      FROM startadd startadd
      CROSS JOIN LATERAL (
        SELECT a_name, b_name, geom
        FROM nodes
        ORDER BY geom <-> startadd.geom
        LIMIT 1
      ) closest),
    end_address_closest_street as (SELECT closest.*, endadd.geom start_point, endadd.node_name
      FROM endadd endadd
      CROSS JOIN LATERAL (
        SELECT a_name, b_name, geom
        FROM nodes
        ORDER BY geom <-> endadd.geom
        LIMIT 1
      ) closest),
    adds as (select * from end_address_closest_street union select * from start_address_closest_street),
    closest_point as (select *, st_closestpoint(geom, start_point) split_point from adds),
    graph as (select closest_point.*, cg.a, cg.b, ST_Azimuth(start_point,split_point) AS az1, ST_Azimuth(split_point, start_point) AS az2, ST_Distance(start_point,split_point) + .0001 AS len from basic_graph cg join closest_point on cg.a_name = closest_point.a_name and cg.b_name = closest_point.b_name),
    new_segments as (select *, ST_MakeLine(ST_TRANSLATE(start_point, sin(az1) * len, cos(az1) * 
    len),ST_TRANSLATE(split_point,sin(az2) * len, cos(az2) * len)), st_split(geom, ST_MakeLine(ST_TRANSLATE(start_point, sin(az1) * len, cos(az1) * 
    len),ST_TRANSLATE(split_point,sin(az2) * len, cos(az2) * len))) divisions from graph),
    divisions_mid as (select *, st_touches(st_geometryn(divisions, 1), a) touches_a, st_geometryn(divisions, 1) new_street_geom from new_segments where st_touches(st_geometryn(divisions, 1), b) or st_touches(st_geometryn(divisions, 1), a) union select *, st_touches(st_geometryn(divisions, 2), a) touches_a, st_geometryn(divisions, 2) new_street_geom from new_segments where st_touches(st_geometryn(divisions, 2), a) or st_touches(st_geometryn(divisions, 2), b)),
    divisions as (select *, st_length(new_street_geom)/st_length(geom) length_frac from divisions_mid),
    newGraph as (select cgv.edge_id, cgv.bike_lanes, cgv.road_type, 
    (case when divisions.node_name = 'START-TERMINUS' then 
    divisions.split_point else (case when divisions.node_name = 'END-TERMINUS' and not divisions.touches_a then cgv.b else cgv.a end) end) as a_geometry, 
    (case when divisions.node_name = 'END-TERMINUS' then 
    divisions.split_point else (case when divisions.node_name = 'START-TERMINUS' and divisions.touches_a then cgv.a else cgv.b end) end) as b_geometry, cgv.street_name, cgv.departing_angle, cgv.arriving_angle,
    (case when divisions.new_street_geom is not null then 
    st_multi(divisions.new_street_geom) else cgv.street_geom end) as geometry,
    (case when divisions.new_street_geom is not null then 
    cgv.street_length*divisions.length_frac else cgv.street_length end) as street_length,
    (case when divisions.node_name = 'START-TERMINUS' then
    divisions.node_name else (case when divisions.node_name = 'END-TERMINUS' and not divisions.touches_a then cgv.b_name else cgv.a_name end) end) as a_name,
    (case when divisions.node_name = 'END-TERMINUS' then
    divisions.node_name else(case when divisions.node_name = 'START-TERMINUS' and divisions.touches_a then cgv.a_name else cgv.b_name end) end) as b_name
    from basic_graph cgv left join divisions on cgv.a_name = divisions.a_name and cgv.b_name = divisions.b_name),
    startingPoint as (select distinct ng.edge_id, ng.bike_lanes, ng.road_type, sa.geom a_geometry, a_geometry b_geometry, ng.street_name, 0 departing_angle, 0 arriving_angle, st_makeline(st_setsrid(sa.geom, 4326), ng.a_geometry) geometry, 1 street_length, 'CURRENT-POSITION' a_name, ng.a_name b_name from newGraph ng inner join startadd sa on ng.a_name like '%START-TERMINUS%'),
    endingPoint as (select distinct ng.edge_id, ng.bike_lanes, ng.road_type,ng.b_geometry a_geometry, sa.geom b_geometry, ng.street_name, 0 departing_angle, 0 arriving_angle, st_makeline(ng.b_geometry, st_setsrid(sa.geom, 4326)) geometry, 1 street_length, ng.b_name a_name, 'ENDING-POSITION' b_name from newGraph ng inner join endadd sa on ng.b_name like '%END-TERMINUS%'),
    finalUnion as (select * from endingPoint union select * from startingPoint union select * from newGraph)
    select road_type, st_asgeojson(a_geometry) a_geometry, st_asgeojson(b_geometry) b_geometry, street_name, departing_angle, arriving_angle, st_asgeojson(geometry) geometry, street_length, a_name, b_name, bike_lanes from finalUnion`,
    [road_types, start_address, end_address]
  );
  

  return results.rows;
};
