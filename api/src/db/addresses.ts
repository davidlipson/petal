import { Pool } from "pg";

export const addressesSuggestions = async (pool: Pool, address: string) => {
  const results = await pool.query(
    `select concat(address,' ',lfname) as name  from address order by similarity(concat(address, ' ', lfname), '${address}') desc limit 3`
  );
  return results.rows;
};
