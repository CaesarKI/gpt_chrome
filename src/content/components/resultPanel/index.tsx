import React, { DOMElement, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import style from './index.less'
import { ArrowLeftOutlined, CloseOutlined, CopyOutlined, RedoOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons'
import { useScroll } from '../../hooks'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import browser from 'webextension-polyfill'
import { message, Tooltip } from 'antd'
import copy from "clipboard-copy";
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import store from '../../store'
import instruct from '@/content/instruct';
import { handelPrompt } from '@/server/openai';
import { tag } from '@/content/shdow-dom';


export interface ResultPanelType {
  onChangePanel: (flag: boolean) => void
  onChangeMessage?: (message: string) => void
}


export default function ResultPanel(props: ResultPanelType) {
  // 增加测试信息
  const { onChangePanel } = props
  const [dragRef, handleMouseDown] = useScroll()
  const controllerRef = useRef<any>({})
  const iconRef = useRef(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [ending, setEnding] = useState(false)
  const container = document.querySelector(tag)
  const bodyRef = useRef(null)
  const shadowRoot: ShadowRoot = container?.shadowRoot as ShadowRoot

  const bodyStyle = useMemo(() => {
    return !ending ? { 'borderBottomLeftRadius': 15, 'borderBottomRightRadius': 15 } : { 'borderRadius': 0 }
  }, [ending])

  const handler = (text: string, err: any, end: boolean | undefined) => {
    if (end) {
      setText(text)
      setLoading(false)
      setEnding(true)
      return
    }

    if (err) {
      setText(err.message)
      setLoading(false)
      setEnding(true)
    } else {
      setText(text)
    }
  }

  const quickReplace = (value) => {
    const map = instruct.map
    for (let item of map) {
      if (item.reg.test(value)) {
        value = value.replace(item.reg, item.label)
        break
      }
    }
    return value

  }

  const getMessage = async () => {
    let value = store.getValue('prompt')
    value = quickReplace(value)
    const openai = store.getValue('openai')
    if (typeof openai === 'object' && openai.key) {
      value && handelPrompt(value, controllerRef, handler)
    } else {
      return message.info('apiKey不存在请到点击设置, 配置apiKey')
    }
  }

  useEffect(() => {
    getMessage()
  }, [])

  const handelback = (e: any) => {
    cancelRequest()
    onChangePanel(false)
    e.stopPropagation()
  }

  const handelClose = (e: any) => {
    cancelRequest()
    var card = shadowRoot.querySelector('#card');
    if (card) {
      card.remove();
    }
    e.stopPropagation()

  }

  const handelCopy = (e: any) => {
    copy(text)
      .then(() => {
        message.info('内容已经复制到剪切板')
      }).catch(() => {
        message.info('内容复制失败')
      })
    e.stopPropagation()
  }

  const cancelRequest = () => {
    if (controllerRef.current.abort) {
      controllerRef.current.abort()
    }
  }

  const handelStop = (e: any) => {
    cancelRequest()
    setLoading(false)
    setEnding(true)
    e.stopPropagation()
  }

  const handelGenerator = () => {
    cancelRequest()
    getMessage()
    setText("")
    setLoading(true)
    setEnding(false)
  }

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const handelCopyCode = () => {
      copy(children)
        .then(() => {
          message.info('内容已经复制到剪切板')
        }).catch(() => {
          message.info('内容复制失败')
        })
    }

    const renderBlock = () => {
      return (
        <div className={style.block} >
          <CopyOutlined className={`${style.icon} ${style.codeIcon}`} onClick={handelCopyCode} />
          <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, '')}
            style={materialDark}
            language={match[1]}
            PreTag="div"
          />
        </div >
      )
    }
    const renderRow = () => {
      return (
        <code {
          ...props
        } className={className} >
          {String(children).replace(/\n$/, '')}
        </code >
      )
    }
    if (match) {
      return renderBlock()
    } else {
      return renderRow()
    }

  }


  const markdownRender = () => {
    return <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: CodeBlock
      }}>{text}</ReactMarkdown>;
  }

  const jump = () => {
    console.log('jump')
    browser.runtime.sendMessage({
      type: "jump"
    });
  }


  return (
    <div className={style.resultPanel} id='resultPandel'  >
      <div className={style.header} ref={dragRef} onMouseDown={handleMouseDown}>
        <div className={style.left} onMouseDown={e => e.stopPropagation()} >
          <Tooltip title='返回上一步' zIndex={11111}>
            <ArrowLeftOutlined className={style.icon} onClick={handelback} />
          </Tooltip>
          <Tooltip title='关闭' zIndex={11111}>
            <CloseOutlined className={style.icon} onClick={handelClose} />
          </Tooltip>
        </div>
        <div className={style.right} onMouseDown={e => e.stopPropagation()}>
          <Tooltip title='跳转到配置面板' zIndex={11111}>
            <SettingOutlined className={style.icon} onClick={jump} />
          </Tooltip>
        </div>
      </div>
      <div className={`${style.body}`} ref={bodyRef} style={bodyStyle}  >
        <div className={style.stop}>
          {loading && (
            <Tooltip title='停止生成对话' zIndex={11111}>
              <SyncOutlined spin onClick={handelStop} ref={iconRef} />
            </Tooltip>
          )}
        </div>
        <div>{markdownRender()}</div>
        {loading && <AutoScroll></AutoScroll>}
      </div>
      {ending && (<div className={style.footer}>
        <Tooltip title='复制' zIndex={11111}>
          <CopyOutlined className={style.icon} onClick={handelCopy} />
        </Tooltip>
        <Tooltip title='再次生成对话' zIndex={11111}>
          <RedoOutlined className={style.icon} onClick={handelGenerator} />
        </Tooltip>
      </div>)}
    </div>
  )
}



const AutoScroll: React.FC = () => {
  const divRef = useRef<HTMLDivElement>()

  useVisibleEffect(divRef)

  return <div className={style.scrollBox} ref={divRef}></div>
}

const useVisibleEffect = (ref: MutableRefObject<HTMLDivElement>) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio !== 1) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
          })
        }
      })
    })

    if (!ref.current) {
      return
    }

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])
}