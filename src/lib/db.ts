import { Pool } from 'pg';

// This prevents TypeScript errors when we attach the pool to the global object.
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

// Use the single connection string from your environment variables
const connectionString = process.env.POSTGRES_URL;

// Throw an error if the connection string is not found
if (!connectionString) {
  throw new Error("The POSTGRES_URL environment variable is not set.");
}

let pool: Pool;

// In a production environment, we create the pool once.
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({ connectionString });
} else {
  // In development, we store the pool on the global object.
  // This prevents a new pool from being created on every hot-reload.
  if (!global.pgPool) {
    global.pgPool = new Pool({ connectionString });
  }
  pool = global.pgPool;
}

export default pool;