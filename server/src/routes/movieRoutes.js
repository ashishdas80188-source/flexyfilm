import express from 'express';
import {
  getMovies,
  getFeaturedMovies,
  getMovieById,
  searchMovies,
  getIndustriesSummary,
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/industries', getIndustriesSummary);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

export default router;
