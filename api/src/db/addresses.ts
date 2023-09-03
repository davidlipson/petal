import { db } from "./db";

export const addressesSuggestions = async (address: string) => {
  const query = ` 
    select 
      full_address
    from addresses
    order by 
      similarity(full_address, '${address}') desc limit 3`;
  const [rows, _result] = await db.query(query);
  return rows;
};
