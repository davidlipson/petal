"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const db_1 = require("../db");
const base = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const long = parseFloat(req.query.long) || -79.42384;
    const lat = parseFloat(req.query.lat) || 43.64453;
    const km = Math.max(0.2, Math.min(parseFloat(req.query.km) || 1, 5));
    try {
        const results = yield (0, db_1.baseLayer)(lat, long, km);
        return res.status(200).json(results);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message);
        return;
    }
});
exports.base = base;
