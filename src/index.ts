import facebookLogin from '..'
import config from '../config/index.config'
import { logService } from './services/log'
import routes from './routes'
import { IncomingMessage } from '../lib/types/incomingMessages'
import { connectPostgres } from './database/connect'

// check username + password
if (!(config.MESSENGER_USERNAME && config.MESSENGER_PASSWORD)) {
  logService('login', 'username or password are not found. See https://github.com/Teav4/bot-vippro/blob/master/README.md')
}

const runner = async (): Promise<unknown> => {
  const api = await facebookLogin({ email: config.MESSENGER_USERNAME, password: config.MESSENGER_PASSWORD })
  
  // check login success
  if (!api) {
    return logService('login', 'login failed.')
  }

  const pgClient = connectPostgres({
    dbHost: config.POSTGRES_HOST as string,
    dbName: config.POSTGRES_DB as string,
    dbUser: config.POSTGRES_USER as string,
    dbPassword: config.POSTGRES_PASSWORD as string,
  })

  // // routines
  await api.listen()
  api.listener?.addListener(
    'message', 
    (message: IncomingMessage) => {
      if (message.isGroup) {
        routes(message, api, pgClient)
      }
    }
  );
}

export default runner
