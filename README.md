# Chirpy
A [Boot.dev](http://www.boot.dev) guided project in Typescript to learn how http servers work. This project is for a product called "Chirpy". Chirpy is a social network similar to Twitter.

## Goals of This Project

- Understand what web servers are and how they power real-world web applications
- Build a production-style HTTP server in Typescript, Node, and Express, without the use of a framework
- Use JSON, headers, and status codes to communicate with clients via a RESTful API
- Learn what makes Typescript and Express a great language for building fast web servers
- Use type safe SQL to store and retrieve data from a Postgres database
- Implement a secure authentication/authorization system with well-tested cryptography libraries
- Build and understand webhooks and API keys
- Document the REST API with markdown

## HTTP Endpoints

| HTTP Method | Endpoint              | Description                                                                                                                                                                                                                        |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | /api/healthz          | Returns an http OK status if the application is running                                                                                                                                                                            |
| POST        | /api/polka/webhooks   | This endpoint is intended to be used by a 3rd party billing platform called "Polka". A JSON body is expected with an event and data.user_id.  If the service returns a valid event parameter, the user has upgraded to Chirpy Red. |
| POST        | /api/login            | Validates the user's password matches their stored password and issues an access token and a refresh token to be used with other post requests.                                                                                    |
| POST        | /api/refresh          | Expects a Bearer refresh token in the header. Returns a new access token.                                                                                                                                                          |
| POST        | /api/revoke           | Expects a Bearer refresh token in the header. Revokes the token's access in the database.                                                                                                                                          |
| POST        | /api/users            | Requires email and password JSON elements in the body of the request. Creates a new user and returns the user details in the response.                                                                                             |
| PUT         | /api/users            | Expects a Bearer refresh token in the header along with the new email and password in the body. Given the user record that matches the Bearer token, the email and password are updated.                                           |
| POST        | /api/chirps           | Expects a Bearer refresh token in the header along with a JSON `body` element. This body is the text for a new chirp that is stored in the database.                                                                               |
| GET         | /api/chirps           | Retrieves all chirps in the database. Can be filtered with a query string: `author_id={user_id}`                                                                                                                                   |
| GET         | /api/chirps/{chirpID} | Retrieves a specific chirp based on the given chirp ID.                                                                                                                                                                            |
| DELETE      | /api/chirps/{chirpID} | Expects a Bearer refresh token in the header to ensure the user is the owner of the given chirp before deleting the chirp record based on the given chirp ID.                                                                      |
| POST        | /admin/reset          | If the dev environment flag is enabled, this endpoint deletes all records in the database.                                                                                                                                         |
| GET         | /admin/metrics        | Reports the number of requests received by the server in HTML.                                                                                                                                                                     |
