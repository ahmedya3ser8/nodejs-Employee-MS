import 'dotenv/config';

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

process.on('unhandledRejection', (err: any) => {
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message} `);
  server.close(() => {
    console.log('Shutting down....');
    process.exit(1);
  });
})