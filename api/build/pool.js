"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolInstance = void 0;
const pg_1 = require("pg");
class PoolInstance {
    constructor() {
        this.pool = new pg_1.Pool({
            host: "localhost",
            port: 5432,
            database: "gis",
            user: "postgres",
        });
    }
    getPool() {
        return this.pool;
    }
}
exports.poolInstance = new PoolInstance();
