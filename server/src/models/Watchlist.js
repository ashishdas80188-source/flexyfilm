import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: String, // String to handle both MongoDB ObjectId and stringified TMDB / mock IDs
      required: true,
    },
    movieData: {
      title: String,
      posterPath: String,
      backdropPath: String,
      rating: Number,
      releaseYear: Number,
      genres: [String],
      language: String,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
