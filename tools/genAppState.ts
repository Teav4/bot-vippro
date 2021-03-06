import facebookLogin from '../index'
import config from '../config/index.config'
import fs from 'fs'
import { logService } from '../src/services/log'

// check username + password
if (!(config.MESSENGER_USERNAME && config.MESSENGER_PASSWORD)) {
  logService('login', 'username or password are not found. See https://github.com/Teav4/bot-vippro/blob/master/README.md')
}

(async () => {
  const api = await facebookLogin({ email: config.MESSENGER_USERNAME, password: config.MESSENGER_PASSWORD })

  if (!api) {
    return logService('login', 'login failed.')
  }
  
  logService('AppState', 'Saving the AppState to file ...')
  fs.writeFileSync(__dirname+'/state/'+config.MESSENGER_USERNAME+'.json', JSON.stringify(api.getAppState()))

  logService('AppState', 'done.')
})()
