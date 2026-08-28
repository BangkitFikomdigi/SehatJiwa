const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load .env.local
dotenv.config({ path: '.env.local' });

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Use the DATABASE_URL from .env.local (which includes the password)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Gagal:', err.message);
  } else {
    console.log('✅ Berhasil! Waktu:', res.rows[0].now);
  }
  pool.end();
});
