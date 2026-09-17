# Event Registration System

A REST API for creating events and managing user registrations.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` in `.env` with your MongoDB Atlas connection string.
4. Start the API with `npm run dev` or `npm start`.

The `.env` file is ignored by Git and must not be committed.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/events` | Create an event |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get event details |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event with no active registrations |
| POST | `/api/events/:eventId/register` | Register for an event |
| GET | `/api/registrations/:email` | Get registrations for an email address |
| DELETE | `/api/events/:eventId/register/:email` | Cancel a registration |

## Event request body

```json
{
  "title": "Developer Meetup",
  "description": "A practical meetup for local developers.",
  "date": "2026-10-15T10:00:00.000Z",
  "location": "Dhaka",
  "capacity": 50
}
```

## Registration request body

```json
{
  "userName": "Jane Doe",
  "userEmail": "jane@example.com"
}
```
