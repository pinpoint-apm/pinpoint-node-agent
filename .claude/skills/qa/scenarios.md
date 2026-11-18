# QA baseline scenarios

Every QA runs these scenarios on each framework the change touches, and reports each expected
value as matched or not. The expected values are what Pinpoint Web shows for release/v1.4 on
Node.js 22.

## App

One app per framework, with the agent loaded by `-r <worktree>/index.js`:

- Express: `app.get(path, handler)`, and after the routes the error-handling middleware
  `app.use((err, req, res, next) => res.status(500).json({ message: err.message }))`
- Koa: `koa-router` `router.get(path, handler)`
- Next.js: one Pages Router API route per path, under `pages/api/`, so each path starts with `/api`

`TARGET_PORT` is a plain `http.createServer()` without the agent that answers `ok`.
`CLOSED_PORT` is a port nothing listens on. Every route answers with JSON.

| Path | Route code |
|---|---|
| `/http-request-ok` | `http.request(http://127.0.0.1:TARGET_PORT/)` with a response listener and an `'error'` listener; 200 when the response ends |
| `/fetch-ok` | `await fetch(http://127.0.0.1:TARGET_PORT/)`; 200 |
| `/http-request-closed-port` | `http.request(http://127.0.0.1:CLOSED_PORT/)` with an `'error'` listener; 502 with `error.code` |
| `/fetch-closed-port` | `await fetch(http://127.0.0.1:CLOSED_PORT/)` in try/catch; 502 with `error.cause.code` |
| `/throw` | `throw new Error('qa route throws')` |

Send one `GET` per path, a second apart.

## Call tree rows

The route row sits between the root and the route's calls:

- Express: `Router.get` (EXPRESS)
- Koa: `Router.get` (KOA)
- Next.js: no route row; the calls sit under the root

## Scenarios

```text
1. A route that calls http.request() and gets a response
   request  GET /http-request-ok
   expect   transaction list  1 row, URL /http-request-ok, no error mark
            call tree         Node Server Process  /http-request-ok, http.status.code 200
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  127.0.0.1:TARGET_PORT/, http.status.code 200
            Error Analysis    no error

2. A route that calls fetch() and gets a response
   request  GET /fetch-ok
   expect   the same rows as scenario 1, with URL /fetch-ok

3. A route whose http.request() fails
   request  GET /http-request-closed-port
   expect   transaction list  1 row, URL /http-request-closed-port, error mark
            call tree         Node Server Process  /http-request-closed-port, http.status.code 502
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  127.0.0.1:CLOSED_PORT/, error
                                        Error: connect ECONNREFUSED 127.0.0.1:CLOSED_PORT
            Error Analysis    1 error, class Error, message connect ECONNREFUSED 127.0.0.1:CLOSED_PORT,
                              URI template /http-request-closed-port (Next.js: null)

4. A route whose fetch() fails
   request  GET /fetch-closed-port
   expect   the same rows as scenario 3, with URL and URI template /fetch-closed-port
            (Next.js: null)

5. A route that throws
   request  GET /throw
   expect   transaction list  1 row, URL /throw, error mark
            call tree         Node Server Process  /throw, http.status.code 500
              Express           Router.get
                                  Router.use  error, Error: qa route throws
              Koa               Router.get  error, Error: qa route throws
              Next.js           no rows under the root
            Error Analysis    Express, Koa: 1 error, class Error, message qa route throws,
                              URI template /throw
                              Next.js: no error

6. Sampling off
   app      PINPOINT_SAMPLING=false
   request  GET /http-request-ok, /fetch-closed-port, /throw
   expect   transaction list  no row from the agent
            agent list        the agent is listed
```
