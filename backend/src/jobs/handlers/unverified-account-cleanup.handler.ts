import { cleanupAccounts } from "../models/unverifiedAccountCleanup.model.js";

export default async function unverifiedAccountCleanupHandler() {
  await cleanupAccounts();
}
