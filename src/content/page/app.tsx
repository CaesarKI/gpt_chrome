import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import store from '../store/index'
import 'antd/dist/reset.css'
import Panel from '../components/index'
import './app.less'
import { tag, containerId } from '../shdow-dom'
import browser from 'webextension-polyfill'
import { Configuration, OpenAIApi } from 'openai'

export default function App() {
  const container = document.querySelector(tag)
  const shadowRoot: ShadowRoot = container?.shadowRoot as ShadowRoot
  const root: any = shadowRoot.getElementById(containerId)
  let flag: boolean
  let timer: any

  const handelEvent = () => {
    const handelClick = (event: any) => {
      if (flag) {
        flag = false
        return
      }
      var card = shadowRoot.querySelector('#card')
      const resultPandel = shadowRoot.querySelector('#resultPandel')
      if (card && container !== event.target && !resultPandel) {
        card.remove()
      }
    }

    const handelCardClick = (event: any) => {
      const target = event.target
      const parentElement = target.parentNode
      createContainer(parentElement)
      target.remove()
      event.stopPropagation()
    }

    // document.addEventListener('mouseup', function (event: any) {
    //   const child = root.querySelector('#card')
    //   if (child) return
    //   clearTimeout(timer)
    //   const selection = window.getSelection()
    //   let selectedText = selection?.toString();
    //   let range:any,rect
    //   //@ts-ignore
    //   if (selectedText) {
    //      range = selection?.rangeCount && selection?.getRangeAt(0);
    //      rect = range?.getBoundingClientRect();
    //   }
    //   if (selectedText && rect) {
    //     store.setValue('text', selectedText)
    //     var card = document.createElement('div');
    //     const btn = document.createElement('div')
    //     btn.setAttribute('id', 'btn')
    //     card.setAttribute('id', 'card')
    //     btn.textContent = 'w';
    //     card.appendChild(btn)
    //     card.style.cssText = `left:${Math.abs(rect.left - 32)}px;top:${rect.top + rect.height}px`
    //     flag = true
    //     root.appendChild(card);
    //     btn.addEventListener('click', handelCardClick)
    //     // timer=setTimeout(()=>{
    //     //   const event=new Event('click')
    //     //   document.dispatchEvent(event)
    //     // },3000)
    //   }
    // });

    document.addEventListener('click', handelClick)
  }

  const createContainer = (parentElement: Element) => {
    const container = document.createElement('div')
    container.setAttribute('id', 'container')
    parentElement.appendChild(container)
    const containerRoot = createRoot(container)
    containerRoot.render(<Panel />)
  }

  const createCard = () => {
    store.setValue('text', '')
    const child = root.querySelector('#card')
    if (child) return
    var card = document.createElement('div')
    card.setAttribute('id', 'card')
    card.style.cssText = `left:50%;top:120px;transform:translateX(-50%)`
    root.appendChild(card)
    createContainer(card)
  }

  const generateGpt = (key) => {
    const config = new Configuration({
      apiKey: key,
    })
    return new OpenAIApi(config)
  }

  const getkey = async () => {
    const value = await browser.storage.sync.get('openai')
    store.setValue('openai', value.openai)
    const gpt = generateGpt(value.openai.key)
    store.setValue('gpt', gpt)
  }

  const handelMessage = () => {
    browser.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message.action === 'open-content') {
        // 执行打开内容的操作
        createCard()
        console.log('Open content triggered by shortcut key')
      }
    })
  }

  useEffect(() => {
    handelEvent()
    handelMessage()
    getkey()
  }, [])
}
