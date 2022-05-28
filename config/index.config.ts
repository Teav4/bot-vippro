import dotenv from 'dotenv'

dotenv.config()

const config = {
  MESSENGER_USERNAME: process.env.MSG_USERNAME,
  MESSENGER_PASSWORD: process.env.MSG_PASSWORD,
}

export default config
