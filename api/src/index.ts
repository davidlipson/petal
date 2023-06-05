
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { addresses, base, route, tile } from "./routes";

(async () => {
  dotenv.config();

  const PORT = 3000;
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/route", route);
  app.get("/addresses", addresses);
  app.get("/base", base);
  app.get("/tile", tile);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
