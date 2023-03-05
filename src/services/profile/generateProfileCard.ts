import { existsSync, mkdirSync } from 'fs'
import { read } from 'jimp'
import path from 'path'
const textToImage = require('text-to-image')

type Input = {
  score: string
  userLv: string
  progress: [number, number]
  userName: string
  userDesc: string
  chatActivity: string
  maxGlobalLv: string
  facebookId: string
  avatar: Buffer
}

const readFromBase64 = (base64String: string) => {
  return read(Buffer.from(base64String.replace(/^data:image\/png;base64,/, ""), 'base64'))
}

const dirPath = path.join(__dirname,'..', '..', '..', '..', 'assets', 'generateProfileCard')
const fontDirPath = path.join(__dirname,'..', '..', '..', '..', 'assets', 'fonts')
const generateTextConfig = {
  bgColor: 'transparent',
  fontPath: fontDirPath+'/static/Inter-Bold.ttf',
  fontSize: 18,
  fontFamily: 'Inter',
  fontWeight: 700,
  textColor: "#FFFFFF"
} 

export const generateProfileCard = async (props: Input) => {
  const textDirPath = path.join(__dirname, '..', '..', '..', '..', 'files', props.facebookId)
  
  if (!existsSync(textDirPath)) {
    mkdirSync(textDirPath)
  }
  
  // gen score
  const scoreBase64 = await textToImage.generate(props.score, {
    ...generateTextConfig,
    textColor: '#0EC0CB'
  })
  const score = await readFromBase64(scoreBase64)

  // gen userLv
  const userLvBase64 = await textToImage.generate(props.userLv, {
    ...generateTextConfig,
    fontSize: 40,
  })
  const userLv = await readFromBase64(userLvBase64)

  // gen userName
  const userNameBase64 = await textToImage.generate(props.userName, {
    ...generateTextConfig,
    textColor: '#000000',
  })
  const userName = await readFromBase64(userNameBase64)

  // gen userDesc
  const userDescBase64 = await textToImage.generate(props.userDesc, {
    ...generateTextConfig,
    textColor: '#000000',
  })
  const userDesc = await readFromBase64(userDescBase64)

  // gen chatActivity
  const chatActivityBase64 = await textToImage.generate(props.chatActivity, {
    ...generateTextConfig,
    textColor: '#000000',
  })
  const chatActivity = await readFromBase64(chatActivityBase64)

  // gen maxGlobalLv
  const maxGlobalLvBase64 = await textToImage.generate(props.maxGlobalLv, {
    ...generateTextConfig,
    textColor: '#000000',
  })
  const maxGlobalLv = await readFromBase64(maxGlobalLvBase64)

  const background = await read(dirPath+'/Background.png')
  const avatar = await read(props.avatar)
  const lv = await read(dirPath+'/Lv..png')
  const progressFilled = await read(dirPath+'/progress_fill.png')
  const progressBackground = await read(dirPath+'/progress_background.png')
  const navBackground = await read(dirPath+'/nav_background.png')
  const line1 = await read(dirPath+'/Line 1.png')
  const line2 = await read(dirPath+'/Line 2.png')
  const infoBackground = await read(dirPath+'/info_background.png')
  const commentDot = await read(dirPath+'/comment_dot.png')
  const strokeBg = await read(dirPath+'/stroke.png')
  const progressBarWidth = Math.round(props.progress[0]/props.progress[1]*324) + 1

  await background
    // nav
    .composite(navBackground, 232, 58)
    .composite(lv, 358, 68)
    .composite(userLv, 352, 72)
    .composite(progressBackground,417, 96)
    .composite(progressFilled.resize(
      progressBarWidth,
      progressFilled.getHeight(),
    ),417, 96)
    .composite(score, 408, 94)

    // bio
    .composite(infoBackground, 232, 140)
    .composite(line1, 298, 179)
    .composite(line2, 298, 221)
    .composite(userName, 388, 140)
    .composite(commentDot, 362, 195)
    .composite(userDesc, 378, 182)
    .composite(chatActivity, 342, 228)
    .composite(maxGlobalLv, 611, 228)

    // avatar
    .composite(
      strokeBg
      .resize(250, 250)
        .circle({
          radius: 250/2,
          x: 250/2,
          y: 250/2,
        })
      , 118, 42)
    .composite(
      avatar
        .resize(230, 230)
        .circle({
          radius: 230/2,
          x: 230/2,
          y: 230/2,
        })
      , 118+(20/2), 42+(20/2)
    )
  
  const filePath = textDirPath+'/profile.jpg'
  await background.writeAsync(filePath)

  return filePath
}
