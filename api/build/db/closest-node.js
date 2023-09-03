"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// not used anymore
/*
export const closestNode = async (pool: Pool, address: string) => {
  const result = await pool.query(`
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
};
*/
