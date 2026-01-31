import startPostgresPing from "./pingdb.queue.js";
import removeUnverifiedAccount from "./unverified-account-cleanup.queue.js";

async function startQueue() {
  await startPostgresPing();
  await removeUnverifiedAccount();
}

export default startQueue;
