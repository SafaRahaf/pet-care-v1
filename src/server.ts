import mongoose from "mongoose";
import config from "./config";
import app from "./app";

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port} 😁`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
