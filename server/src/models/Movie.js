import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title'],
      trim: true,
    },
    originalTitle: {
      type: String,
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Please provide overview'],
    },
    tagline: {
      type: String,
    },
    posterPath: {
      type: String,
      required: true,
    },
    backdropPath: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    releaseDate: {
      type: String,
    },
    runtime: {
      type: Number, // in minutes
      default: 120,
    },
    rating: {
      type: Number,
      default: 7.5,
      min: 0,
      max: 10,
    },
    voteCount: {
      type: Number,
      default: 1500,
    },
    genres: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'Hindi',
    },
    industry: {
      type: String,
      enum: [
        'Bollywood',
        'Hollywood',
        'Tollywood',
        'Ollywood',
        'Sandalwood',
        'Kollywood',
        'Mollywood',
        'Punjabi',
        'Bengali',
        'Marathi',
        'Web Series',
      ],
      default: 'Bollywood',
    },
    type: {
      type: String,
      enum: ['movie', 'series'],
      default: 'movie',
    },
    maturityRating: {
      type: String,
      default: 'U/A 16+',
    },
    cast: [
      {
        name: String,
        character: String,
        profilePath: String,
      },
    ],
    director: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes for text querying
movieSchema.index({
  title: 'text',
  originalTitle: 'text',
  director: 'text',
  'cast.name': 'text',
});

export const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
