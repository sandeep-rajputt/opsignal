import { query } from "../../config/db.js";

export async function cleanupAccounts() {
  await query(`
            DELETE FROM users 
            WHERE email_verified = false 
            AND createdat < NOW() - INTERVAL '3 hours';
    `);
  return;
}
