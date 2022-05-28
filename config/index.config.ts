import dotenv from 'dotenv'

dotenv.config()

const config = {
  MESSENGER_USERNAME: process.env.MSG_USERNAME,
  MESSENGER_PASSWORD: process.env.MSG_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
}

export default config
