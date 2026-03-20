import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import dashboardRoutes from "./dashboard.routes";
import employeesRoutes from "./employees.routes";
import productsRoutes from "./products.routes";
import newsRoutes from "./news.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use(authenticate, authorize("admin", "manager"));

router.use(dashboardRoutes);
router.use(employeesRoutes);
router.use(productsRoutes);
router.use(newsRoutes);
router.use(uploadRoutes);

export default router;
