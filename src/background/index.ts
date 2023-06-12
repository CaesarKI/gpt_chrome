import browser from 'webextension-polyfill'


browser.commands.onCommand.addListener(async function (command) {
  if (command === "open-content") {
    const querying: browser.Tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true })
    browser.tabs.sendMessage(querying[0].id as number, { action: "open-content" });

  }
});


browser.action.onClicked.addListener(function (tab) {
  browser.runtime.openOptionsPage();
});

// 在扩展的后台脚本中监听消息
browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'jump') {
    browser.runtime.openOptionsPage();
  }
});