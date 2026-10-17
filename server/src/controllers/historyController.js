import { Storage } from '../services/storageService.js';

export const getWatchHistory = async (req, res) => {
  try {
    const history = await Storage.getWatchHistory(req.user._id);
    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWatchProgress = async (req, res) => {
  try {
    const { movieId, progressSeconds, totalSeconds, movieData } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    const updated = await Storage.updateWatchProgress(
      req.user._id,
      movieId,
      Number(progressSeconds) || 0,
      Number(totalSeconds) || 7200,
      movieData || {}
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearWatchHistory = async (req, res) => {
  try {
    await Storage.clearWatchHistory(req.user._id);
    res.json({
      success: true,
      message: 'Watch history cleared',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
