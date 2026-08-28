const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('ALTER TABLE account ADD COLUMN IF NOT EXISTS issuer text', (err, res) => {
  if (err) {
    console.error('❌ Error:', err.message);
  } else {
    console.log('✅ Column issuer added!');
  }
  pool.end();
});
