import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import {
  getDashboardStats,
  getTopEventsByRegistration,
  eventsByCategory,
  getTopEventsByRevenue,
  eventsStatus,
} from "../controllers/dashboard.controller.ts";
import { protect } from "middlewares/auth.middleware.ts";
import { restrictTo } from "middlewares/restrictTo.middleware.ts";

const router = Router();

const DASHBOARD = API_ENDPOINTS.admin.dashboard;

router.use(protect, restrictTo("admin"));

router.get(DASHBOARD.stats, getDashboardStats);
router.get(DASHBOARD.topEventsByRegistration, getTopEventsByRegistration);
router.get(DASHBOARD.eventsByCategory, eventsByCategory);
router.get(DASHBOARD.topEventsByRevenue, getTopEventsByRevenue);
router.get(DASHBOARD.eventsStatus, eventsStatus);

export default router;
