import { Request, Response } from "express";
import { addressesSuggestions } from "../db";

export const addresses = async (req: Request, res: Response) => {
  const address = req.query.address as string;
  if (address?.length > 3) {
    try {
      const results = await addressesSuggestions(address);
      return res.status(200).json(results);
    } catch (e: any) {
      res.status(400).send(e.message);
      return;
    }
  }
  return res.status(200).json([]);
};
