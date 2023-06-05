import { Pool } from "pg";

class PoolInstance {
    pool: Pool
    constructor(){
        this.pool = new Pool({
            host: "localhost",
            port: 5432,
            database: "gis",
            user: "postgres",
          });
    }
    getPool(){
        return this.pool
    }
}

export const poolInstance = new PoolInstance()