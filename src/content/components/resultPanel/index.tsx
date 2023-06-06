import React, { DOMElement, useEffect, useRef, useState } from 'react'
import style from './index.less'
import { ArrowLeftOutlined, CloseOutlined, CopyOutlined, RedoOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons'
import { useScroll } from '../../hooks'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { message } from 'antd'
import store from '../../store'
import { handelPrompt } from '@/server/openai';
import { tag } from '@/content/shdow-dom';

export interface ResultPanelType {
  onChangePanel: (flag: boolean) => void
  onChangeMessage?: (message: string) => void
}


export default function ResultPanel(props: ResultPanelType) {
  const { onChangePanel } = props
  const [dragRef, handleMouseDown] = useScroll()
  const controllerRef = useRef<any>({})
  const iconRef = useRef(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const container = document.querySelector(tag)
  const shadowRoot: ShadowRoot = container?.shadowRoot as ShadowRoot

  const handler = (text: string, err: any, end: boolean | undefined) => {

    if (end) {
      setText(text)
      setLoading(false)
      return
    }

    if (err) {
      setText(err.message)
      setLoading(false)
    } else {
      setText(text)
    }
  }

  const getMessage = async () => {
    const value = store.getValue('prompt')
    if (value) {
      handelPrompt(value, controllerRef, handler)
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
    navigator.clipboard.writeText(text)
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
    e.stopPropagation()
  }

  const handelGenerator=()=>{
    cancelRequest()
    getMessage()
    setText("")
    setLoading(true)

  }

  const CodeBlock = (props: any) => {
    return (
      <SyntaxHighlighter language={props.className} style={materialDark}>
        {props.children[0]}
      </SyntaxHighlighter>
    );
  };

  const markdownRender = () => {
    return <ReactMarkdown components={{ code: CodeBlock }}>{text}</ReactMarkdown>;
  }


  return (
    <div className={style.resultPanel}>
      <div className={style.header} ref={dragRef} onMouseDown={handleMouseDown}>
        <div className={style.left}>
          <ArrowLeftOutlined className={style.icon} onClick={handelback} />
          <CloseOutlined className={style.icon} onClick={handelClose} />
        </div>
        <div className={style.right}>
          <SettingOutlined className={style.icon} />
        </div>
      </div>
      <div className={style.body}>
        <div className={style.stop}>
          {loading && <SyncOutlined spin onClick={handelStop} ref={iconRef} />}
        </div>
        {markdownRender()}
      </div>
      <div className={style.footer}>
        <CopyOutlined className={style.icon} onClick={handelCopy} />
        <RedoOutlined className={style.icon} onClick={handelGenerator} />
      </div>

    </div>
  )
}
