import B2Client from 'backblaze-b2'
import config from '../../config/index.config'

const b2 = new B2Client({
  applicationKey: config.B2_APP_KEY as string,
  applicationKeyId: config.B2_APP_ID as string
})

type ResponseProps = {
  files: File[]
}

type File = {
  accountId: string,
  action: string,
  bucketId: string,
  contentLength: number,
  contentMd5: string,
  contentSha1: string,
  contentType: 'image/jpeg',
  fileId: string,
  fileInfo: unknown,
  fileName: string,
  fileRetention: unknown,
  legalHold: unknown,
  serverSideEncryption: unknown,
  uploadTimestamp: number
}

export async function getListArt(): Promise<ResponseProps> {
  await b2.authorize();
  const response = await b2.listFileNames({
    bucketId: config.B2_BUCKET_ID as string,
    startFileName: 'art/',
    maxFileCount: 1000,
    delimiter: '',
    prefix: '',
  })

  return response.data
}
