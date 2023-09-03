"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
exports.User = sequelize_2.sequelize.define("user", {
    username: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
});
