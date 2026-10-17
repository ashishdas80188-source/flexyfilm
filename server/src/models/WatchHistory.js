import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    progressSeconds: {
      type: Number,
      default: 0,
    },
    totalSeconds: {
      type: Number,
      default: 7200, // 2 hours default
    },
    completed: {
      type: Boolean,
      default: false,
    },
    movieData: {
      title: String,
      posterPath: String,
      backdropPath: String,
      rating: Number,
      releaseYear: Number,
      runtime: Number,
      genres: [String],
      language: String,
      type: String,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

watchHistorySchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
export default WatchHistory;
