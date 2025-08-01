/**
 * Pinpoint Node.js Agent Express 5 Demo Application
 *
 * This demo showcases Express 5 features with Pinpoint monitoring:
 * - Native async/await route handlers
 * - Improved error handling
 * - Promise-based middleware
 * - Router functionality
 */

// Initialize Pinpoint Agent first
require('pinpoint-node-agent')

const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3005

// Middleware
app.use(express.json())
app.use(express.static('public'))

// Express 5 async middleware example
app.use(async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  // Express 5 automatically handles Promise rejections
  await new Promise(resolve => setTimeout(resolve, 10))
  next()
})

// Basic route with async/await
app.get('/', async (req, res) => {
  // Express 5 natively supports Promises
  await new Promise(resolve => setTimeout(resolve, 50))
  res.json({
    message: 'Welcome to Express 5 Demo with Pinpoint!',
    version: '5.x',
    timestamp: new Date().toISOString(),
    features: [
      'Native async/await support',
      'Automatic Promise error handling',
      'Improved Router architecture',
      'Better performance'
    ]
  })
})

// Async route with external API call
app.get('/api/users', async (req, res) => {
  try {
    // This will be traced by Pinpoint as an outgoing request
    const response = await axios.get('https://jsonplaceholder.typicode.com/users')

    // Transform data with async processing
    const users = await Promise.all(
      response.data.slice(0, 5).map(async (user) => {
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 10))
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company.name
        }
      })
    )

    res.json({
      success: true,
      count: users.length,
      users
    })
  } catch (error) {
    // Express 5 automatically catches and handles this error
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
})

// Route with query parameters
app.get('/api/search', async (req, res) => {
  const { q, limit = 10 } = req.query

  if (!q) {
    return res.status(400).json({
      error: 'Query parameter "q" is required'
    })
  }

  // Simulate async search operation
  await new Promise(resolve => setTimeout(resolve, 100))

  const results = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
    id: i + 1,
    title: `Search result ${i + 1} for "${q}"`,
    relevance: Math.random(),
    timestamp: new Date().toISOString()
  }))

  res.json({
    query: q,
    limit: parseInt(limit),
    results: results.sort((a, b) => b.relevance - a.relevance)
  })
})

// Express 5 Router example
const apiRouter = express.Router()

// Router-level middleware
apiRouter.use(async (req, res, next) => {
  console.log('API Router middleware executed')
  next()
})

// Async routes in router
apiRouter.get('/status', async (req, res) => {
  const status = {
    service: 'Express 5 Demo API',
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  }

  res.json(status)
})

apiRouter.post('/echo', async (req, res) => {
  // Echo back the request body with additional info
  await new Promise(resolve => setTimeout(resolve, 25))

  res.json({
    echo: req.body,
    receivedAt: new Date().toISOString(),
    headers: {
      'content-type': req.get('content-type'),
      'user-agent': req.get('user-agent')
    }
  })
})

// Mount the router
app.use('/api/v1', apiRouter)

// Error simulation route
app.get('/error', async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const _ = { req, res } // Express route requires these parameters
  // Express 5 will automatically catch this error
  throw new Error('This is a simulated error for testing!')
})

// Async error in Promise chain
app.get('/async-error', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 50))

  // This will be automatically caught by Express 5
  const data = await Promise.reject(new Error('Async operation failed!'))
  res.json({ data })
})

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  }

  res.json(health)
})

// Express 5 error handler
app.use(async (error, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const _ = next // Express error handler requires 4 parameters
  console.error('Error caught by Express 5 error handler:', error.message)

  // Log error details (this would be traced by Pinpoint)
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  }

  console.error('Error details:', errorDetails)

  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use(async (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/users',
      'GET /api/search?q=term',
      'GET /api/v1/status',
      'POST /api/v1/echo',
      'GET /health',
      'GET /error (for testing)',
      'GET /async-error (for testing)'
    ]
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Express 5 Demo Server Started!
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📊 Pinpoint Agent: Enabled
⚡ Express Version: 5.x

Available endpoints:
- GET  /              - Welcome page
- GET  /api/users     - Fetch users from external API
- GET  /api/search    - Search with query parameters
- GET  /api/v1/status - Service status
- POST /api/v1/echo   - Echo request body
- GET  /health        - Health check
- GET  /error         - Error simulation
- GET  /async-error   - Async error simulation
`)
})

module.exports = app
