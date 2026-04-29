import starkbank from 'starkbank';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.STARKBANK_PRIVATE_KEY;
const projectId = process.env.STARKBANK_PROJECT_ID;
const environment = (process.env.STARKBANK_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production';

if (!privateKey || !projectId) {
  throw new Error('Missing STARKBANK_PRIVATE_KEY or STARKBANK_PROJECT_ID in environment variables.');
}

starkbank.user = new starkbank.Project({
  environment,
  id: projectId,
  privateKey,
});

export default starkbank;
