import { Pool } from 'pg';

// This prevents TypeScript errors when we attach the pool to the global object.
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

let pool: Pool;

const poolConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432,
  // You can add more production-ready settings here
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

// In a production environment, we create the pool once.
if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  // In development, we store the pool on the global object.
  // This prevents a new pool from being created on every hot-reload.
  if (!global.pgPool) {
    global.pgPool = new Pool(poolConfig);
  }
  pool = global.pgPool;
}

export default pool;