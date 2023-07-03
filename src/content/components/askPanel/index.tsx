import React, { useEffect, useRef, useState } from 'react'
import { Input } from 'antd'
import { DragOutlined } from '@ant-design/icons'
import style from './index.less'
import store from '../../store'
import { ResultPanelType } from '../resultPanel'
import { useScroll } from '../../hooks/index'
import {
  StyleProvider,
} from '@ant-design/cssinjs';
import { tag } from '@/content/shdow-dom'
const { TextArea } = Input



export default function AskPanel(props: ResultPanelType) {
  const { onChangePanel } = props
  const [value, setValue] = useState(store.getValue('text'))
  const inputRef = useRef(null)
  const [dragRef, handleMouseDown] = useScroll()
  const container = document.querySelector(tag)
  const shadowRoot: ShadowRoot = container?.shadowRoot as ShadowRoot


  const handelPressEnter = async (e: any) => {
    e.preventDefault()
    onChangePanel(true)
    store.setValue('prompt', value)
  }


  useEffect(() => {
    const current: any = inputRef.current
    if (current && value) {
      current.focus()
      const textareaEle = current.resizableTextArea.textArea
      textareaEle.setSelectionRange(value.length, value.length);
    }
  }, [])

  return (
    <StyleProvider container={shadowRoot}>
      <div className={style.askPanel}>
        <div className={style.content}>
          <div className={style.drag} ref={dragRef} onMouseDown={handleMouseDown} >
            <DragOutlined />
          </div>
          <TextArea
            ref={inputRef}
            rows={1}
            value={value}
            placeholder="please input your questions"
            style={{ width: '100%', wordBreak: 'break-all' }}
            autoSize
            allowClear
            bordered
            onPressEnter={handelPressEnter}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div >
    </StyleProvider>

  )
}
