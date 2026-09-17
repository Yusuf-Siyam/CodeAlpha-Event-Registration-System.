const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEventId = (eventId) => mongoose.Types.ObjectId.isValid(eventId);

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isValidEmail = (email) => emailPattern.test(email);

const sendErrorResponse = (res, error) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: Object.values(error.errors).map((validationError) => validationError.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'This email is already registered for the event.',
    });
  }

  console.error(`Registration request error: ${error.message}`);
  return res.status(500).json({
    message: 'An unexpected server error occurred.',
  });
};

const registerForEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!isValidEventId(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID.' });
  }

  const userEmail = normalizeEmail(req.body?.userEmail);

  if (!isValidEmail(userEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const existingRegistration = await Registration.findOne({
      event: event._id,
      userEmail,
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: 'This email is already registered for the event.',
      });
    }

    const registrationCount = await Registration.countDocuments({ event: event._id });

    if (registrationCount >= event.capacity) {
      return res.status(409).json({ message: 'This event is full.' });
    }

    const registration = await Registration.create({
      userName: req.body?.userName,
      userEmail,
      event: event._id,
    });

    return res.status(201).json({
      message: 'Registration created successfully.',
      registration,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const getRegistrationsByEmail = async (req, res) => {
  const userEmail = normalizeEmail(req.params.email);

  if (!isValidEmail(userEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const registrations = await Registration.find({ userEmail }).populate(
      'event',
      'title description date location capacity'
    );

    return res.status(200).json({ registrations });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const cancelRegistration = async (req, res) => {
  const { eventId } = req.params;

  if (!isValidEventId(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID.' });
  }

  const userEmail = normalizeEmail(req.params.email);

  if (!isValidEmail(userEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const registration = await Registration.findOneAndDelete({
      event: event._id,
      userEmail,
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    return res.status(200).json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  registerForEvent,
  getRegistrationsByEmail,
  cancelRegistration,
};
