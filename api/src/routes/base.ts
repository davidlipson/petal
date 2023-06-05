import { Request, Response } from "express";
import { baseLayer } from "../db";
import { poolInstance } from "../pool";

export const base = async (req: Request, res: Response) => {
  const long = parseFloat(req.query.long as string) || -79.423840
  const lat = parseFloat(req.query.lat as string) || 43.644530
  const km = Math.max(0.2, Math.min(parseFloat(req.query.km as string) || 1, 5));
  const pool = poolInstance.getPool();
  try {
    const results = await baseLayer(pool, lat, long, km);
    return res.status(200).json(results);
  } catch (e: any) {
    console.log(e)
    res.status(400).send(e.message);
    return;
  }
};
