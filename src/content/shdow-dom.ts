import '@webcomponents/custom-elements';


const tag = 'gpt-container'
const containerId = 'gpt_extension'


class GptContainer extends HTMLElement {
  constructor() {
    super()
    // 创建一个沙盒
    const shadow = this.attachShadow({ mode: 'open' })
    const container = document.createElement('div')
    container.setAttribute('id', containerId)
    shadow.appendChild(container)
  }
}

customElements.define(tag, GptContainer)
export { tag, containerId }