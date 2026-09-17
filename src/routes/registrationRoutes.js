const express = require('express');
const {
  registerForEvent,
  getRegistrationsByEmail,
  cancelRegistration,
} = require('../controllers/registrationController');

const router = express.Router();

router.post('/events/:eventId/register', registerForEvent);
router.get('/registrations/:email', getRegistrationsByEmail);
router.delete('/events/:eventId/register/:email', cancelRegistration);

module.exports = router;
