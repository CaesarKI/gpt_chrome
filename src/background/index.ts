import browser from 'webextension-polyfill'


browser.commands.onCommand.addListener(async function (command) {
  if (command === "open-content") {
    const querying:browser.Tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true })
    browser.tabs.sendMessage(querying[0].id as number, { action: "open-content" });

  }
});