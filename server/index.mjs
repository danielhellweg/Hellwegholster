import { createApp } from './app.mjs';

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
const host = process.env.HOST || '0.0.0.0';
const app = createApp();
const server = app.listen(port, host, () => console.log(`HELLWEG website listening on port ${port}`));
server.requestTimeout = 30000;
server.headersTimeout = 15000;
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 25000).unref();
});
