"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const basicSettings = {
    logging: false,
    dialect: "postgres",
};
let sql;
if (process.env.DATABASE_URL) {
    sql = new sequelize_1.Sequelize(process.env.DATABASE_URL, Object.assign(Object.assign({}, basicSettings), { dialectOptions: {
            ssl: {
                require: false,
                rejectUnauthorized: false,
            },
        } }));
}
else {
    sql = new sequelize_1.Sequelize(Object.assign(Object.assign({}, basicSettings), { host: process.env.DB_HOST || "localhost", port: parseInt(process.env.DB_PORT || "5432"), database: process.env.DB_NAME || "petaldev" }));
}
exports.db = sql;
