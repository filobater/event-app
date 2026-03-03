import app from "./app.ts";
import mongoose from "mongoose";

const PORT = process.env.PORT ?? "5000";

mongoose
  .connect(process.env.DB_URI ?? "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
