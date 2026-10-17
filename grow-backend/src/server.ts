import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./database/mongoose.js";
import { ensureAdminUsers } from "./utils/ensureAdmin.js";

const start = async () => {
  try {
    // check database connection env
    const dbConnectionEnv = config.MONGODB_URI;

    await connectDB();
    await ensureAdminUsers();
    const app = createApp();
    app.listen(config.PORT, () => {
    });
  } catch (err) {
    process.exit(1);
  }
};

start();
