const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const eventFields = ['title', 'description', 'date', 'location', 'capacity'];

const getEventData = (data = {}) => {
  const requestData = data || {};

  return eventFields.reduce((eventData, field) => {
    if (requestData[field] !== undefined) {
      eventData[field] = requestData[field];
    }

    return eventData;
  }, {});
};

const isValidEventId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendErrorResponse = (res, error) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: Object.values(error.errors).map((validationError) => validationError.message),
    });
  }

  console.error(`Event request error: ${error.message}`);
  return res.status(500).json({
    message: 'An unexpected server error occurred.',
  });
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(getEventData(req.body));

    return res.status(201).json({
      message: 'Event created successfully.',
      event,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    return res.status(200).json({
      events,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const getEventById = async (req, res) => {
  if (!isValidEventId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid event ID.',
    });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found.',
      });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const updateEvent = async (req, res) => {
  if (!isValidEventId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid event ID.',
    });
  }

  const eventData = getEventData(req.body);

  if (Object.keys(eventData).length === 0) {
    return res.status(400).json({
      message: 'Provide at least one event field to update.',
    });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found.',
      });
    }

    if (eventData.capacity !== undefined) {
      const requestedCapacity = Number(eventData.capacity);

      if (Number.isInteger(requestedCapacity) && requestedCapacity >= 1) {
        const registrationCount = await Registration.countDocuments({ event: event._id });

        if (requestedCapacity < registrationCount) {
          return res.status(409).json({
            message: 'Event capacity cannot be lower than the current registration count.',
          });
        }
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: 'Event updated successfully.',
      event: updatedEvent,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const deleteEvent = async (req, res) => {
  if (!isValidEventId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid event ID.',
    });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found.',
      });
    }

    const hasRegistrations = await Registration.exists({ event: event._id });

    if (hasRegistrations) {
      return res.status(409).json({
        message: 'Cancel all registrations before deleting this event.',
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
