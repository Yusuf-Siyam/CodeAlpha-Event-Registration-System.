const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
      minlength: [2, 'Event title must be at least 2 characters long.'],
      maxlength: [150, 'Event title cannot exceed 150 characters.'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required.'],
      trim: true,
      minlength: [10, 'Event description must be at least 10 characters long.'],
      maxlength: [2000, 'Event description cannot exceed 2000 characters.'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required.'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required.'],
      trim: true,
      minlength: [2, 'Event location must be at least 2 characters long.'],
      maxlength: [200, 'Event location cannot exceed 200 characters.'],
    },
    capacity: {
      type: Number,
      required: [true, 'Event capacity is required.'],
      min: [1, 'Event capacity must be at least 1.'],
      validate: {
        validator: Number.isInteger,
        message: 'Event capacity must be a whole number.',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
