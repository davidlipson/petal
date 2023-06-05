import { Request, Response } from "express";
import { centreline } from "../db";
import { RouteGraph } from "../graph";
import { poolInstance } from "../pool";

export const route = async (req: Request, res: Response) => {
  const pool = poolInstance.getPool();
  const { start_address, end_address } = req.query;

  if (!start_address || !end_address) {
    res.status(400).send("Missing start_address or end_address");
    return;
  }

  try {
    const rows = await centreline(
      pool,
      start_address as string,
      end_address as string
    );
    const graph = new RouteGraph(rows);
    const directions = graph.getDirections();
    return res.status(200).json({ directions });
  } catch (e: any) {
    console.log(e);
    res.status(400).send(e.message);
    return;
  }
};