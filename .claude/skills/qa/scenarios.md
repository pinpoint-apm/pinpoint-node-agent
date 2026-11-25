# QA baseline scenarios

Every QA runs these scenarios on Express, Koa and Next.js, and reports each expected value as
matched or not. The expected values are what Pinpoint Web shows when the agent works correctly,
on Node.js 22.

## Apps

`apps/` holds the apps. Their dependencies resolve from the repository's `node_modules`.

| File | Role |
|---|---|
| `apps/calls.js` | the calls every route makes: outgoing HTTP, databases, other apps |
| `apps/express.js` | Express, `app.get(path, handler)`, then an error-handling middleware that answers 500 |
| `apps/koa.js` | Koa, `koa-router` `router.get(path, handler)` |
| `apps/nextjs/` | Next.js, one Pages Router API route per path, so each path starts with `/api` |
| `apps/target.js` | the server the outgoing calls reach, without the agent; answers `ok` |

Environment of every app:

| Variable | Value |
|---|---|
| `EXPRESS_PORT`, `KOA_PORT`, `NEXTJS_PORT` | the port of each app; every app reads all three to call the others |
| `TARGET_PORT` | the port of `apps/target.js` |
| `CLOSED_PORT` | a port nothing listens on |
| `QA_MYSQL_URL`, `QA_PG_URL`, `QA_REDIS_URL`, `QA_MONGODB_URL` | connection URLs of the databases |

Start them:

1. Databases from the images in `test/support/shared-containers.js` (`mysql:8.0.31`,
   `postgres:13`, `redis:7.2`, `mongo:6.0.1`), with `test/fixtures/db/mysql.sql` and
   `test/fixtures/db/postgresql.sql` as init scripts, database `test`.
2. `node apps/target.js`
3. `node -r <worktree>/index.js apps/express.js` and `apps/koa.js`
4. In `apps/nextjs`: `next build`, then `next start -p $NEXTJS_PORT` with
   `NODE_OPTIONS="-r <worktree>/index.js"`. Use the `next` of the repository's `node_modules`.
5. `GET /ready` on each app (`/api/ready` on Next.js). It opens the database connections; its
   transaction is setup, not a scenario.

Send one `GET` per path, a second apart.

## Call tree rows

The route row sits between the root and every call the route makes, the calls after an `await`
included:

- Express: `Router.get` (EXPRESS), then `Asynchronous Invocation` (ASYNC)
- Koa: `Router.get` (KOA), then `Asynchronous Invocation` (ASYNC)
- Next.js: no route row; the calls sit under the root

Pinpoint Web removes an `Asynchronous Invocation` with no row under it from a complete transaction,
so the route row of a handler that makes no call is `Router.get` alone.

An outgoing HTTP call is three rows, the same for `http.request()` and `fetch()`:

```text
http.request  (ASYNC_HTTP_CLIENT)
  Asynchronous Invocation  (ASYNC)
    GET  <host:port><path>, http.status.code <status>
```

## Calls between apps

Each app calls the other two, one with `http.request()` and one with `fetch()`:

| Caller | `http.request()` to | `fetch()` to |
|---|---|---|
| Express | Koa | Next.js |
| Koa | Next.js | Express |
| Next.js | Express | Koa |

`/call-<app>` calls `/downstream` of that app, `/call-<app>-throw` calls `/downstream-throw`, and
the caller answers with the status and body it got. `/downstream` answers with the `Pinpoint-*`
headers it received.

## Scenarios

### 1. Outgoing HTTP calls

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

5. A route whose http.request() to localhost fails on every address
   request  GET /http-request-localhost-closed-port
   expect   transaction list  1 row, URL /http-request-localhost-closed-port, error mark
            call tree         Node Server Process  /http-request-localhost-closed-port, http.status.code 502
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  localhost:CLOSED_PORT/, error
                                        AggregateError [ECONNREFUSED]: (Next.js: AggregateError:)
            Error Analysis    3 errors, URI template /http-request-localhost-closed-port (Next.js: null):
                              class AggregateError, empty message, first stack trace line
                              internalConnectMultiple in node:net with its line number
                              class Error, message connect ECONNREFUSED ::1:CLOSED_PORT
                              class Error, message connect ECONNREFUSED 127.0.0.1:CLOSED_PORT

6. A route whose fetch() to localhost fails on every address
   request  GET /fetch-localhost-closed-port
   expect   the same rows as scenario 5, with URL and URI template /fetch-localhost-closed-port
            (Next.js: null)
```

### 2. Database calls

```text
7. A route that queries MySQL with mysql2
   request  GET /mysql2
   expect   transaction list  1 row, URL /mysql2, no error mark
            call tree         Node Server Process  /mysql2, http.status.code 200
                                <route row>
                                  PoolConnection.query  (MYSQL), SQL SELECT id, name FROM member WHERE id = ?,
                                                        SQL-BindValue a
                                    Pool.getConnection  (MYSQL)
                                      Asynchronous Invocation  (ASYNC)
                                        PoolConnection.query  (MYSQL)
            Error Analysis    no error

8. A route whose MySQL query fails
   request  GET /mysql2-error
   expect   transaction list  1 row, URL /mysql2-error, error mark
            call tree         Node Server Process  /mysql2-error, http.status.code 500
                                <route row>
                                  PoolConnection.query  (MYSQL), SQL SELECT id FROM no_such_table
                                    Pool.getConnection  (MYSQL)
                                      Asynchronous Invocation  (ASYNC)
                                        PoolConnection.query  (MYSQL)
                                    Asynchronous Invocation  (ASYNC), error
                                      Error: Table 'test.no_such_table' doesn't exist
            Error Analysis    1 error, class Error, message Table 'test.no_such_table' doesn't exist,
                              URI template /mysql2-error (Next.js: null)

9. A route that queries PostgreSQL
   request  GET /pg
   expect   transaction list  1 row, URL /pg, no error mark
            call tree         Node Server Process  /pg, http.status.code 200
                                <route row>
                                  Client.query  (POSTGRESQL), SQL SELECT id, name FROM member WHERE id = $1,
                                                SQL-BindValue a
            Error Analysis    no error

10. A route whose PostgreSQL query fails
   request  GET /pg-error
   expect   transaction list  1 row, URL /pg-error, error mark
            call tree         Node Server Process  /pg-error, http.status.code 500
                                <route row>
                                  Client.query  (POSTGRESQL), SQL SELECT id FROM no_such_table
                                    Asynchronous Invocation  (ASYNC), error
                                      error: relation "no_such_table" does not exist
            Error Analysis    1 error, class error, message relation "no_such_table" does not exist,
                              URI template /pg-error (Next.js: null)

11. A route that sets a key with redis
   request  GET /redis
   expect   transaction list  1 row, URL /redis, no error mark
            call tree         Node Server Process  /redis, http.status.code 200
                                <route row>
                                  RedisClient.set  (REDIS)

12. A route that sets a key with ioredis
   request  GET /ioredis
   expect   transaction list  1 row, URL /ioredis, no error mark
            call tree         Node Server Process  /ioredis, http.status.code 200
                                <route row>
                                  Redis.set  (REDIS)

13. A route that finds a MongoDB document
   request  GET /mongodb
   expect   transaction list  1 row, URL /mongodb, no error mark
            call tree         Node Server Process  /mongodb, http.status.code 200
                                <route row>
                                  MongoClient.find  (MONGO)

14. A route that runs fetch() and a mysql2 query at the same time
   request  GET /parallel
   expect   transaction list  1 row, URL /parallel, no error mark
            call tree         Node Server Process  /parallel, http.status.code 200
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  127.0.0.1:TARGET_PORT/, http.status.code 200
                                  PoolConnection.query  (MYSQL), the rows of scenario 7
```

### 3. Route handlers

```text
15. A route that throws
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

16. A route that awaits three fetch() calls in a row
   request  GET /fetch-after-await
   expect   transaction list  1 row, URL /fetch-after-await, no error mark
            call tree         Node Server Process  /fetch-after-await, http.status.code 200
                                <route row>
                                  the rows of an outgoing HTTP call to 127.0.0.1:TARGET_PORT/,
                                  three times, all under the same <route row>
            Error Analysis    no error

17. A route that calls fetch() in a setTimeout callback
   request  GET /fetch-in-timer
   expect   the same rows as scenario 2, with URL /fetch-in-timer

18. A middleware that awaits, calls fetch() and then next() (Express)
   request  GET /middleware-await
   expect   transaction list  1 row, URL /middleware-await, no error mark
            call tree         Node Server Process  /middleware-await, http.status.code 200
                                Router.use  (EXPRESS)
                                  Asynchronous Invocation  (ASYNC)
                                    the rows of an outgoing HTTP call to 127.0.0.1:TARGET_PORT/
                                Router.get  (EXPRESS)
            Error Analysis    no error

19. A route of a mounted Express sub-app (Express)
   request  GET /admin/users/1
   expect   transaction list  1 row, URL /admin/users/1, no error mark
            call tree         Node Server Process  /admin/users/1, http.status.code 200
                                Router.use  (EXPRESS)
                                  Asynchronous Invocation  (ASYNC)
                                    Router.get  (EXPRESS)
                                      Asynchronous Invocation  (ASYNC)
                                        the rows of an outgoing HTTP call to 127.0.0.1:TARGET_PORT/
            URI stats         a row /users/:id

20. A Koa route that dispatches to the routes of another router (Koa)
   request  GET /v2/users/1
   expect   transaction list  1 row, URL /v2/users/1, no error mark
            call tree         Node Server Process  /v2/users/1, http.status.code 200
                                Router.get  (KOA)
                                  Asynchronous Invocation  (ASYNC)
                                    Router.get  (KOA)
                                      Asynchronous Invocation  (ASYNC)
                                        the rows of an outgoing HTTP call to 127.0.0.1:TARGET_PORT/
            URI stats         a row /v2/(.*), the URI template of the dispatching route
```

### 4. Calls between apps

```text
21. A route that calls another app
   request  GET /call-<app> for both other apps
   expect   transaction list  2 rows with the same transaction id: the caller's /call-<app> and
                              the called app's /downstream, no error mark
            call tree         Node Server Process  /call-<app>, http.status.code 200
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  127.0.0.1:<app port><app path prefix>/downstream,
                                           http.status.code 200
                                        Node Server Process  /downstream of the called app,
                                                             http.status.code 200
                                          Express, Koa: Router.get of the called app, which makes no call
            response          pinpoint-traceid = the transaction id, pinpoint-spanid = the span id of
                              /downstream, pinpoint-pspanid = the span id of /call-<app>,
                              pinpoint-flags 0, pinpoint-pappname = the caller's application name,
                              pinpoint-papptype 1400, pinpoint-pservicename = the caller's service name,
                              pinpoint-host 127.0.0.1:<app port>

22. A route that calls another app that throws
   request  GET /call-<app>-throw for both other apps
   expect   transaction list  2 rows with the same transaction id, both with an error mark
            call tree         Node Server Process  /call-<app>-throw, http.status.code 500
                                <route row>
                                  http.request  (ASYNC_HTTP_CLIENT)
                                    Asynchronous Invocation  (ASYNC)
                                      GET  127.0.0.1:<app port><app path prefix>/downstream-throw,
                                           http.status.code 500
                                        Node Server Process  /downstream-throw, http.status.code 500
                                          the rows of scenario 15 for the called app, with the message
                                          qa downstream throws
            Error Analysis    called app Express, Koa: 1 error, class Error, message qa downstream throws,
                              URI template /downstream-throw
                              called app Next.js: no error

23. A route that calls another app with sampling off in the caller
   app      the caller with PINPOINT_SAMPLING=false, the called apps with sampling on
   request  GET /call-<app> for both other apps
   expect   transaction list  no row from the caller or the called app
            response          only pinpoint-sampled s0
```

### 5. Requests from outside

```text
24. A request from an app outside Pinpoint
   request  GET /downstream with Pinpoint-TraceID qa-external-<app>^<epoch ms>^1,
            Pinpoint-SpanID 1111111111, Pinpoint-pSpanID 2222222222, Pinpoint-Flags 0,
            Pinpoint-pAppName qa-external, Pinpoint-pAppType 1000,
            Pinpoint-pServiceName qa-external-service, Pinpoint-Host 127.0.0.1:<app port>
   expect   transaction list  1 row, URL /downstream, transaction id = the Pinpoint-TraceID,
                              span id 1111111111
            call tree         Unknown  No Agent Data
                                Node Server Process  /downstream, http.status.code 200
                                  <route row>

25. A request with sampling off from the caller
   request  GET /downstream with Pinpoint-Sampled s0
   expect   transaction list  no row
```

### 6. Sampling

```text
26. Sampling off
   app      PINPOINT_SAMPLING=false
   request  GET /http-request-ok, /fetch-closed-port, /throw, /mysql2
   expect   transaction list  no row from the agent
            agent list        the agent is listed
```

### 7. URI stats

```text
27. URI stats with the default settings
   app      default settings: URI stats on, uriStats.httpMethod off, uriStats.useUserInput on
   request  GET /fetch-ok, then /user-input-uri, which sets the URI template /user/input/uri
   expect   URI stats         Express, Koa: a row /fetch-ok and a row /user/input/uri, no HTTP method
                              Next.js: a row /user/input/uri; no row for /api/fetch-ok

28. URI stats with the HTTP method
   app      PINPOINT_FEATURES_URI_STATS_HTTP_METHOD=true
   request  GET /fetch-ok
   expect   URI stats         Express, Koa: a row /fetch-ok with the HTTP method GET
                              Next.js: no row

29. URI stats without the user input
   app      PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT=false
   request  GET /user-input-uri
   expect   URI stats         Express, Koa: a row /user-input-uri, the route URI template
                              Next.js: no row

30. URI stats off
   app      PINPOINT_FEATURES_URI_STATS=false
   request  GET /fetch-ok, then /user-input-uri
   expect   URI stats         no row from the app
```

### 8. Query summary

```text
31. Query summary off, the default
   app      default settings, the run of scenarios 1-25
   request  the query routes of scenarios 7, 8, 9, 10 and 14
   expect   query summary     no query of the application in that run

32. Query summary on
   app      query summary on, started fresh
   request  GET /ready, then /mysql2, /mysql2-error, /pg, /parallel once each
   expect   query summary     grouped by query, the count for each app:
                              SELECT id, name FROM member WHERE id = ?   2 (/mysql2 and /parallel)
                              SELECT id, name FROM member WHERE id = $1  1
                              SELECT id FROM no_such_table               1
                              SELECT ?                                   2 (the SELECT 1 of /ready on
                                                                           mysql2 and pg)
```
