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
}

export default config
