import { EdgeArgs } from "../graph";
import { db } from "./db";

enum Terminus {
  STARTING = "starting",
  ENDING = "ending",
}

const selectAddress = (address: string, terminus: Terminus) => {
  return `(select *, '${terminus}-terminus' node_name from addresses a where (full_address = '${address}') limit 1)`;
};

const closestStreet = (terminus: Terminus) => {
  return `
    (SELECT closest.*, ${terminus}.geometry terminus_point, ${terminus}.node_name
    FROM ${terminus}
    CROSS JOIN LATERAL (
      SELECT a_intersection, b_intersection, geometry
      FROM nodes
      ORDER BY geometry <-> ${terminus}.geometry
      LIMIT 1
    ) closest)`;
};

// clean it up :)
export const centreline = async (
  starting_address: string,
  ending_address: string
): Promise<EdgeArgs[]> => {
  const nodes = `(select geometry, a_intersection, b_intersection from petal group by geometry, a_intersection, b_intersection)`;
  const graph = `(select 
    closest_point.*, 
    cg.a, cg.b, 
    ST_Azimuth(terminus_point, split_point) AS az1, 
    ST_Azimuth(split_point, terminus_point) AS az2, 
    ST_Distance(terminus_point,split_point) + .0001 AS len 
    from petal cg join closest_point on cg.a_intersection = closest_point.a_intersection and cg.b_intersection = closest_point.b_intersection)`;
  const new_segments = `
  (select *, 
    ST_MakeLine(ST_TRANSLATE(terminus_point, sin(az1) * len, cos(az1) * len),
    ST_TRANSLATE(split_point,sin(az2) * len, cos(az2) * len)), 
    st_split(geometry, ST_MakeLine(ST_TRANSLATE(terminus_point, sin(az1) * len, cos(az1) * len),
    ST_TRANSLATE(split_point,sin(az2) * len, cos(az2) * len))) divisions from graph)`;
  const divisions_mids = `
  (select *, 
    st_touches(st_geometryn(divisions, 1), a) touches_a, 
    st_geometryn(divisions, 1) new_street_geom 
    from new_segments where 
      st_touches(st_geometryn(divisions, 1), b) or 
      st_touches(st_geometryn(divisions, 1), a) union 
    select *, 
      st_touches(st_geometryn(divisions, 2), a) touches_a, 
      st_geometryn(divisions, 2) new_street_geom 
      from new_segments 
        where st_touches(st_geometryn(divisions, 2), a) or 
        st_touches(st_geometryn(divisions, 2), b))
  `;
  const divisions = `(select *, st_length(new_street_geom)/st_length(geometry) length_frac from divisions_mid)`;
  const new_graph = `
    (select cgv.id, cgv.fcode, 
      (case when divisions.node_name = 'starting-terminus' then 
        divisions.split_point 
          else (case when divisions.node_name = 'ending-terminus' and not divisions.touches_a then cgv.b else cgv.a end) end) as a_geometry, 
      (case when divisions.node_name = 'endin-terminus' then 
        divisions.split_point 
        else (case when divisions.node_name = 'starting-terminus' and divisions.touches_a then cgv.a else cgv.b end) end) as b_geometry, cgv.street_name, cgv.departing_angle, cgv.arriving_angle,
      (case when divisions.new_street_geom is not null then 
        st_multi(divisions.new_street_geom) 
        else cgv.geometry end) as geometry,
      (case when divisions.new_street_geom is not null then 
        cgv.length*divisions.length_frac 
        else cgv.length end) as length,
      (case when divisions.node_name = 'starting-terminus' then
        divisions.node_name 
        else (case when divisions.node_name = 'ending-terminus' and not divisions.touches_a then 
          cgv.b_intersection else cgv.a_intersection end) end) as a_intersection,
      (case when divisions.node_name = 'ending-terminus' then
        divisions.node_name 
        else (case when divisions.node_name = 'starting-terminus' and divisions.touches_a then 
          cgv.a_intersection else cgv.b_intersection end) end) as b_intersection
      from petal cgv left join divisions on cgv.a_intersection = divisions.a_intersection and cgv.b_intersection = divisions.b_intersection)`;
  const starting_point = `
    (select distinct 
        ng.id, 
        ng.fcode, 
        sa.geometry a_geometry, 
        a_geometry b_geometry, 
        ng.street_name, 
        0 departing_angle, 
        0 arriving_angle, 
        st_makeline(st_setsrid(sa.geometry, 4326), ng.a_geometry) geometry, 
        1 length, 
        'CURRENT-POSITION' a_intersection, 
        ng.a_intersection b_intersection 
      from newGraph ng inner join starting sa on ng.a_intersection like '%starting-terminus%')`;
  const ending_point = `
    (select distinct 
        ng.id, 
        ng.fcode, 
        ng.b_geometry a_geometry, 
        sa.geometry b_geometry, 
        ng.street_name, 
        0 departing_angle, 
        0 arriving_angle, 
        st_makeline(ng.b_geometry, st_setsrid(sa.geometry, 4326)) geometry, 
        1 length, 
        ng.b_intersection a_intersection, 
        'ENDING-POSITION' b_intersection 
      from newGraph ng inner join ending sa on ng.b_intersection like '%ending-terminus%')`;
  const final_union = `(select * from endingPoint union select * from startingingPoint union select * from newGraph)`;
  const adds = `(select * from ending_address_closest_street union select * from starting_address_closest_street)`;
  const closest_point = `(select *, st_closestpoint(geometry, terminus_point) split_point from adds)`;
  const query = `with 
      ${Terminus.STARTING} as ${selectAddress(
    starting_address,
    Terminus.STARTING
  )},
      ${Terminus.ENDING} as ${selectAddress(ending_address, Terminus.ENDING)},
      nodes as  ${nodes},
    starting_address_closest_street as ${closestStreet(Terminus.STARTING)},
    ending_address_closest_street as ${closestStreet(Terminus.ENDING)},
    adds as ${adds},
    closest_point as ${closest_point},
    graph as ${graph},
    new_segments as ${new_segments},
    divisions_mid as ${divisions_mids},
    divisions as ${divisions},
    newGraph as ${new_graph},
    startingingPoint as ${starting_point},
    endingPoint as ${ending_point},
    finalUnion as ${final_union}
    select 
      fcode, 
      st_asgeojson(a_geometry) a_geometry, 
      st_asgeojson(b_geometry) b_geometry, 
      street_name, 
      departing_angle, 
      arriving_angle, 
      st_asgeojson(geometry) geometry, 
      length, 
      a_intersection, 
      b_intersection
    from finalUnion`;
  const [rows, _result] = await db.query(query);
  return rows as EdgeArgs[];
};
