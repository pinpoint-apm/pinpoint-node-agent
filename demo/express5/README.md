# Express 5 Demo Application

Express 5 demonstration application with Pinpoint Node.js Agent integration.

## Features

This demo showcases Express 5's new capabilities with Pinpoint monitoring:

- ✨ **Native async/await route handlers** - No more manual try/catch blocks
- 🚀 **Automatic Promise error handling** - Express 5 catches Promise rejections automatically
- 🏗️ **Modern Router architecture** - Enhanced Router.prototype support
- 📊 **Pinpoint APM Integration** - Full request tracing and monitoring
- 🌐 **External API calls** - Outgoing request tracing with axios
- 🔧 **Error simulation routes** - Testing error handling capabilities

## Quick Start

### 1. Install Dependencies
```bash
cd demo/express5
npm install
```

### 2. Start the Application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### 3. Access the Application
Open your browser and navigate to: http://localhost:3005

## Available Endpoints

### Main Routes
- `GET /` - Welcome page with Express 5 features overview
- `GET /health` - Application health check
- `GET /api/users` - Fetch users from external API (JSONPlaceholder)
- `GET /api/search?q=term&limit=10` - Search with query parameters

### API Router (`/api/v1`)
- `GET /api/v1/status` - Service status and metrics
- `POST /api/v1/echo` - Echo request body with metadata

### Testing Routes
- `GET /error` - Simulate synchronous error
- `GET /async-error` - Simulate asynchronous error

## Express 5 Features Demonstrated

### 1. Native Async/Await Support
```javascript
app.get('/api/users', async (req, res) => {
  const response = await axios.get('https://api.example.com/users')
  res.json(response.data)
  // No manual try/catch needed - Express 5 handles Promise rejections
})
```

### 2. Automatic Error Handling
```javascript
app.get('/error', async (req, res) => {
  throw new Error('This error is automatically caught!')
  // Express 5 automatically passes this to error handlers
})
```

### 3. Promise-based Middleware
```javascript
app.use(async (req, res, next) => {
  await someAsyncOperation()
  next() // Automatic error propagation
})
```

## Pinpoint Monitoring

This application includes Pinpoint Node.js Agent integration to monitor:

- **HTTP Requests**: All incoming requests are traced
- **External API Calls**: Outgoing axios requests to JSONPlaceholder API
- **Error Tracking**: Both sync and async errors are captured
- **Performance Metrics**: Response times, throughput, and resource usage
- **Router Tracing**: Express Router operations are instrumented

## Configuration

### Environment Variables
- `PORT` - Server port (default: 3005)
- `NODE_ENV` - Environment mode
- Pinpoint configuration via standard environment variables

### Pinpoint Agent Configuration
The agent is initialized at the top of `app.js`:
```javascript
require('pinpoint-node-agent')
```

Configure Pinpoint settings through environment variables or `pinpoint-config.json`.

## Testing the Application

### Basic Functionality
```bash
# Welcome page
curl http://localhost:3005/

# Health check
curl http://localhost:3005/health

# External API call (traced by Pinpoint)
curl http://localhost:3005/api/users

# Search with parameters
curl "http://localhost:3005/api/search?q=test&limit=5"
```

### API Router
```bash
# Service status
curl http://localhost:3005/api/v1/status

# Echo endpoint
curl -X POST http://localhost:3005/api/v1/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Express 5!"}'
```

### Error Handling
```bash
# Synchronous error
curl http://localhost:3005/error

# Asynchronous error
curl http://localhost:3005/async-error
```

## Development

### File Structure
```
demo/express5/
├── app.js          # Main application file
├── package.json    # Dependencies and scripts
├── README.md       # This file
└── public/         # Static files (if any)
```

### Key Dependencies
- `express@^5.1.0` - Express 5 framework
- `axios@^1.6.8` - HTTP client for external API calls
- `pinpoint-node-agent` - APM monitoring agent

## Express 4 vs Express 5 Comparison

| Feature | Express 4 | Express 5 |
|---------|-----------|-----------|
| Async/Await | Manual try/catch required | Native support |
| Promise Handling | Manual error handling | Automatic catching |
| Router Architecture | Basic prototype | Enhanced prototype |
| Error Propagation | Manual next(error) | Automatic |
| Performance | Good | Improved |

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE :::3005
   ```
   Solution: Change port or kill existing process
   ```bash
   PORT=3006 npm start
   ```

2. **Pinpoint Connection Issues**
   Check Pinpoint collector configuration and network connectivity.

3. **External API Timeouts**
   The demo uses JSONPlaceholder API which might be slow. Check network connectivity.

## Learn More

- [Express 5 Documentation](https://expressjs.com/en/guide/migrating-5.html)
- [Pinpoint APM](https://pinpoint-apm.gitbook.io/pinpoint/)
- [Node.js Async/Await Best Practices](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
