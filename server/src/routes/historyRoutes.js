import express from 'express';
import {
  getWatchHistory,
  updateWatchProgress,
  clearWatchHistory,
} from '../controllers/historyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All history routes are protected

router.get('/', getWatchHistory);
router.post('/progress', updateWatchProgress);
router.delete('/', clearWatchHistory);

export default router;
