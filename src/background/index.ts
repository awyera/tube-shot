chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "open_options_page") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const videoInfo = { title: tab.title || '', url: tab.url || '' };

      chrome.storage.local.set({ videoInfo }, () => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("options.html"),
          active: false
        });
      })
    })
  }
});
