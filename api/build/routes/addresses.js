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
exports.addresses = void 0;
const db_1 = require("../db");
const addresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.query.address;
    if ((address === null || address === void 0 ? void 0 : address.length) > 3) {
        try {
            const results = yield (0, db_1.addressesSuggestions)(address);
            return res.status(200).json(results);
        }
        catch (e) {
            res.status(400).send(e.message);
            return;
        }
    }
    return res.status(200).json([]);
});
exports.addresses = addresses;
