import { queueOptions } from "../../config/bullmq.js";
import { Queue } from "bullmq";

const pingDbQueue = new Queue("ping-db", queueOptions);

async function startPostgresPing() {
  console.log("start postgresql ping");
  await pingDbQueue.add(
    "ping",
    {},
    {
      repeat: {
        every: 20 * 1000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    },
  );
}

export default startPostgresPing;
