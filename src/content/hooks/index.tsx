import React, { useRef } from 'react'
import { tag } from '../shdow-dom'


type UseScrollType = {
  dragRef: React.MutableRefObject<null>
  handleMouseDown: (event: any) => void
}

export function useScroll(): [UseScrollType["dragRef"], UseScrollType["handleMouseDown"]] {
  const dragRef = useRef(null)
  let offsetX: number, offsetY: number

  // 鼠标移动事件
  function handleMouseMove(event: any) {
    const container = document.querySelector(tag)
    const shadowRoot: ShadowRoot = container.shadowRoot as ShadowRoot
    const card: any = shadowRoot.getElementById('card')
    if (card) {
      const newX = event.clientX - offsetX;
      const newY = event.clientY - offsetY;
      // 更新拖拽元素的位置
      card.style.left = newX + 'px';
      card.style.top = newY + 'px';
      card.style.cssText = `left:${newX}px;top:${newY}px`
    }
    event.stopPropagation()
  }

  // 鼠标松开事件
  function handleMouseUp(event: any) {
    // 解绑拖拽事件
    event.stopPropagation()
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }


  // 鼠标按下事件
  function handleMouseDown(event: any) {

    const element = event.target
    const current: any = dragRef.current
    const elementRect = element.getBoundingClientRect()
    if (current) {
      offsetX = event.clientX - elementRect.left;
      offsetY = event.clientY - elementRect.top
      // 绑定拖拽事件
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    event.stopPropagation()

  }

  return [dragRef, handleMouseDown]
}

