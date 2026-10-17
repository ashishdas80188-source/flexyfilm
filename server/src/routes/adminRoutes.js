import express from 'express';
import {
  getDashboardStats,
  createMovie,
  updateMovie,
  deleteMovie,
  toggleFeatured,
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin routes are protected and require admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);
router.patch('/movies/:id/feature', toggleFeatured);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
