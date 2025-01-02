const captureScreenshot = () => {
  const video = document.querySelector<HTMLVideoElement>('video')
  if (!video) {
    throw new Error('player is not found.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('context is not found.')
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  chrome.storage.local.set({ screenshot: canvas.toDataURL("image/png") }, () => {
    chrome.runtime.sendMessage({ type: "open_options_page" });
  })
}

const mountScreenshotButton = () => {
  const ytpRightControls = document.querySelector('.ytp-right-controls')
  if (!ytpRightControls) {
    throw new Error('ytpRightControls is not found.')
  }

  const button = document.createElement('button')
  button.title = 'Capture a screenshot'
  button.classList.add('ytp-button')
  button.textContent = '📸'
  button.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    float: left;
  `

  button.addEventListener('click', captureScreenshot)

  ytpRightControls.insertBefore(button, ytpRightControls.firstChild)
}

const onDomChanged = (mutationList: MutationRecord[], observer: MutationObserver) => {
  for (const mutation of mutationList) {
    if (mutation.type !== 'childList') {
      continue
    }

    if (document.querySelector('.ytp-right-controls')) {
      mountScreenshotButton()
      observer.disconnect()
      return
    }
  }
}

const observer = new MutationObserver(onDomChanged)
observer.observe(document.body, { childList: true, subtree: true })
