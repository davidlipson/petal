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
exports.addressesSuggestions = void 0;
const db_1 = require("./db");
const addressesSuggestions = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
    select 
      full_address
    from addresses
    order by 
      similarity(full_address, '${address}') desc limit 3`;
    const [rows, _result] = yield db_1.db.query(query);
    return rows;
});
exports.addressesSuggestions = addressesSuggestions;
