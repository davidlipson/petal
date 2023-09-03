import { Request, Response } from "express";
import { baseLayer } from "../db";

export const base = async (req: Request, res: Response) => {
  const long = parseFloat(req.query.long as string) || -79.42384;
  const lat = parseFloat(req.query.lat as string) || 43.64453;
  const km = Math.max(
    0.2,
    Math.min(parseFloat(req.query.km as string) || 1, 5)
  );
  try {
    const results = await baseLayer(lat, long, km);
    return res.status(200).json(results);
  } catch (e: any) {
    console.log(e);
    res.status(400).send(e.message);
    return;
  }
};
