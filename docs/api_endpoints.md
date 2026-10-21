# Ledgerly API

This page documents the endpoints currently available in the backend.

## Base URL

Local: `http://localhost:8000`

The backend auth routes currently start with `/auth/` (not `/api/auth/`).
If using the React app's `VITE_API_URL`, set it to `http://localhost:8000`.

## Authentication

Login and registration are public. Profile and logout require the token returned by login or registration.

Send the token in this header:

```http
Authorization: Token <token>
```

For JSON requests, send `Content-Type: application/json`.

## Register

`POST /auth/register/`

Request:

```json
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "your-password"
}
```

Success (`201 Created`):

```json
{
  "token": "<token>",
  "username": "alex",
  "message": "Registration successful. Please check your mail for the OTP to verify your account."
}
```

`email` is optional. A verification code is emailed when an email address is provided you mega enforce it oo so the user no go dey able reach the dashboard until they verify their email.

## Login

`POST /auth/login/`

Request:

```json
{
  "username": "alex",
  "password": "your-password"
}
```

Success (`200 OK`):

```json
{
  "token": "<token>",
  "message": "Login Successfull"
}
```

Invalid credentials return `400 Bad Request`:

```json
{
  "error": "Invalid credentials"
}
```

## Get profile

`GET /auth/profile/`

Requires the authentication header above.

Success (`200 OK`):

```json
{
  "username": "alex",
  "is_authenticated": true
}
```

## Logout

`POST /auth/logout/`

Requires the authentication header above. A successful logout invalidates the token.

Success (`200 OK`):

```json
{
  "message": "Successfully logged out."
}
```

After logging out, remove the saved token in the React app.

## Not available yet

The backend does not currently provide OTP verification/resend, token refresh, profile updates, business, transactions, documents, dashboard, or insights endpoints. The verification code is emailed during registration, but there is no endpoint to submit it yet.

The React app currently uses an `/api` base URL and calls some endpoints listed above as not available. Its requests need to match the routes and `Token` authentication format documented here, or the backend routes need to be updated.
