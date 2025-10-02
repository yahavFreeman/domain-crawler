import "express" from "express";
import crawlerRoutes from "./api/crawler/crawler.routes.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/crawler", crawlerRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;