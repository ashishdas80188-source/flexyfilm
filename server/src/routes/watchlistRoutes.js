import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All watchlist routes are protected

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);
router.get('/status/:movieId', checkWatchlistStatus);

export default router;
