const { query } = require('../lib/db')

async function Home() {
  const users = await query('SELECT * FROM member')

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {Array.isArray(users) && users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

module.exports = Home