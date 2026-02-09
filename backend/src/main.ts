import "dotenv/config";
import { createWebApp } from "./core/applications/web";

const PORT = process.env.PORT || 3000;

function bootstrap() {
  const app = createWebApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

bootstrap();