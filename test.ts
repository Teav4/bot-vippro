import { youtubeDl } from './src/services/youtubeDl'

youtubeDl('https://www.youtube.com/watch?v=AI24NCKB7-k')
  .then(() => console.log('done'))
