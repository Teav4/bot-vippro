import facebookLogin from '..'
import config from '../config/index.config'
import { logService } from './services/log'
import routes from './routes'

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

  // // routines
  await api.listen()
  api.listener?.addListener('message', (message) => routes(message, api));
}

export default runner
