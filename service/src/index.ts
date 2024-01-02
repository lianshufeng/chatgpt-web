import * as console from 'console'
import express from 'express'
import COS from 'cos-nodejs-sdk-v5'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'

const app = express()
const router = express.Router()

const cos = new COS({
  SecretId: process.env.COS_SecretId,
  SecretKey: process.env.COS_SecretKey,
})

const postTextContentAuditing = function (text) {
  return new Promise((resolve, reject) => {
    const config = {
      // 需要替换成您自己的存储桶信息
      Bucket: process.env.COS_Bucket, // 存储桶，必须
      Region: process.env.COS_Region, // 存储桶所在地域，比如ap-beijing，必须
    }
    const host = `${config.Bucket}.ci.${config.Region}.myqcloud.com`
    const key = 'text/auditing' // 固定值，必须
    const url = `https://${host}/${key}`
    const body = COS.util.json2xml({
      Request: {
        Input: {
          Content: COS.util.encodeBase64(text), /* 需要审核的文本内容 */
        },
        Conf: {
          BizType: '',
        },
      },
    })
    cos.request({
      Method: 'POST', // 固定值，必须
      Url: url, // 请求的url，必须
      Key: key, // 固定值，必须
      ContentType: 'application/xml', // 固定值，必须
      Body: body, // 请求体参数，必须
    },
    (err, data) => {
      if (err) {
        // 处理请求失败
        console.error(err)
        reject(err)
      }
      else {
        resolve(data.Response)
      }
    })
  })
}

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  console.log('request-body : ', req.body)
  const body: any = await postTextContentAuditing(req.body.prompt)
  const politicsInfo = body.JobsDetail.Section.PoliticsInfo
  if (parseInt(politicsInfo.Score) > 80) {
    console.log('敏感内容: ', politicsInfo)
    const ret = {
      message: `敏感内容: 【${JSON.stringify(politicsInfo.HitInfos)}】`,
      status: 'Done',
    }
    res.write(JSON.stringify(ret))
    res.end()
    return
  }

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.get('/sleep', async (req, res) => {
  const time = Number(req.query.time)
  await new Promise((resolve) => {
    setTimeout(resolve, time)
  })

  res.setHeader('Content-type', 'application/octet-stream')
  try {
    res.write(JSON.stringify({ time: new Date().getTime() }))
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
