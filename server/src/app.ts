import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error-handler";
import healthRoutes from "./routes/health.routes";
import productsRoutes from "./routes/products.routes";
import branchesRoutes from "./routes/branches.routes";
import ordersRoutes from "./routes/orders.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin";

export function createApp(): express.Application {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan("dev"));

  // Swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use(authRoutes);
  app.use(healthRoutes);
  app.use(productsRoutes);
  app.use(branchesRoutes);
  app.use(ordersRoutes);
  app.use(adminRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
