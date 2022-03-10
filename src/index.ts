import dotenv from 'dotenv';

import App from './app';

dotenv.config();

async function main() {
  const { PORT } = process.env;

  const app = new App((PORT as unknown as number) || 8080);

  await app.listen();
}

main().then();
