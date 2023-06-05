import { Request, Response } from "express";
import { poolInstance } from "../pool";

export const tile = async (req: Request, res: Response) => {
  const pool = poolInstance.getPool();
  const { lat1, long1, lat2, long2 } = req.query;
  console.log(lat1, long1, lat2, long2, req.query)
  if (!lat1 || !long1 || !lat2 || !long2) {
    res.status(400).send("Missing lat long coordinates");
    return;
  }

  try {
    console.log(`select st_asmvt(q, 'internal-layer-name', 4096, 'geom') tile
    from (select st_asmvtgeom(geom, ST_MakeEnvelope(${long1}, ${lat1}, ${long2}, ${lat2}, 4326), 4096, 0, false) geom from centreline c) q`)
    const result = await pool.query(
      `select st_asmvt(q, 'internal-layer-name', 4096, 'geom') tile
        from (select st_asmvtgeom(geom, ST_MakeEnvelope(${long1}, ${lat1}, ${long2}, ${lat2}, 4326), 4096, 0, false) geom from centreline c) q`
    );
    console.log(result);
    if (result.rows.length == 0) {
      res.status(400).send("No data found");
      return;
    }
    return res.status(200).json(result.rows[0]);
  } catch (e: any) {
    console.log(e);
    res.status(400).send(e.message);
    return;
  }
};
