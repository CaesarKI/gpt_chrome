import { Configuration, OpenAIApi } from 'openai'
import browser from 'webextension-polyfill'
import store from '@/content/store'

const generateGpt = (key) => {
  const config = new Configuration({
    apiKey: key,
  })
  return new OpenAIApi(config)
}


browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "change") {
    // 执行相应的操作
    console.log("Received message from options_ui");
    const { value = {} } = message
    store.setValue('openai', value)
    const gpt = generateGpt(value.key)
    store.setValue('gpt', gpt)
  }
});