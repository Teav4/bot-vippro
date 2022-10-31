import dotenv from 'dotenv'

dotenv.config()

const config = {
  MESSENGER_USERNAME: process.env.MSG_USERNAME,
  MESSENGER_PASSWORD: process.env.MSG_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  SANKAKU_USERNAME: process.env.SANKAKU_USERNAME,
  SANKAKU_PASSWORD: process.env.SANKAKU_PASSWORD,
  USER_AGENT: process.env.USER_AGENT,
  B2_BUCKET_ID: process.env.B2_BUCKET_ID,
  B2_APP_ID: process.env.B2_APP_ID,
  B2_APP_KEY: process.env.B2_APP_KEY,
  B2_BASE_CDN: 'https://cdn.teav4.com',
  GOOGLE_KEY: process.env.GOOGLE_KEY
}

export default config
