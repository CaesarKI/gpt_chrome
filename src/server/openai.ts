import { Configuration, OpenAIApi } from 'openai'
import { API_KEY, MODEL, Temperature } from '@/constant/index'

let gpt: any
const config = new Configuration({
  apiKey: API_KEY,
})

gpt = new OpenAIApi(config)


const axiosOptionForOpenAI = (
  onData: (text: string, err?: any, end?: boolean) => void
) => ({
  responseType: 'stream' as ResponseType,
  onDownloadProgress: (e: any) => {
    try {
      if (e.currentTarget.status !== 200) {
        onData('', new Error(e.currentTarget.responseText), false)
        return
      }
  
      const lines = e.currentTarget.response
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '')


      let result = ''


      let ended = false

      for (const line of lines) {
        const message = line.replace(/^data: /, '')

        if (message === '[DONE]') {
          // stream finished
          ended = true
          break
        }

        const parsed = JSON.parse(message)

        const text =
          parsed.choices[0].text ||
          parsed.choices[0]?.delta?.content ||
          parsed.choices[0]?.message?.content ||
          ''

        if (!text && !result) {
          continue
        }

        result += text

        // edits don't support stream
        if (parsed.object === 'edit') {
          ended = true
          break
        }
      }

      if (ended) {
        onData(result, '', true)
      } else {
        onData?.(result)
      }
    } catch (e) {
      // expose current response for error display
      onData?.('', e.currentTarget.response)
    }
  },
})

export const handelPrompt = async(prompt: string,ref:any,onData: (text: string, err?: any, end?: boolean) => void) => {
  const controller = new AbortController();

  const commonOption = {
    max_tokens: 4000 - prompt.replace(/[\u4e00-\u9fa5]/g, 'aa').length,
    stream: true,
    model: MODEL,
    temperature: Temperature,
  }
  ref.current=controller

  try {
    await gpt.createChatCompletion(
      {
        ...commonOption,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        ...axiosOptionForOpenAI(onData),
        signal: controller.signal
      }
    )
  } catch (error:any) {
    console.log(error.message);
  }
}