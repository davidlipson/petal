import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { addresses, base, route } from "./routes";
import { sequelize } from "./new-db";

(async () => {
  await sequelize.sync();

  dotenv.config();

  const PORT = 3000;
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/route", route);
  app.get("/addresses", addresses);
  app.get("/base", base);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
