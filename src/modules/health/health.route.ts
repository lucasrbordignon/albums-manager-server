import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    errors: null,
  });
});

export default router;