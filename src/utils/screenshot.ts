import { promiseTimeout } from '@vueuse/core'

export const getScreenshotUnavailableMessage = () => {
  if (!window.isSecureContext)
    return '当前页面不是安全上下文，浏览器不会开放系统截图。请用 Chrome 或 Edge 打开本地地址。'

  return '当前运行环境没有开放系统截图能力，请在 Chrome 或 Edge 浏览器窗口中使用，或先截图后通过图片发送。'
}

export const captureDisplayScreenshot = async () => {
  if (!navigator.mediaDevices?.getDisplayMedia)
    throw new Error('unsupported')

  let stream: MediaStream | undefined

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    })

    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    video.playsInline = true

    await video.play()
    await promiseTimeout(180)

    const sourceWidth = video.videoWidth || 1920
    const sourceHeight = video.videoHeight || 1080
    const maxWidth = 1440
    const scale = Math.min(1, maxWidth / sourceWidth)

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sourceWidth * scale))
    canvas.height = Math.max(1, Math.round(sourceHeight * scale))

    const context = canvas.getContext('2d')
    if (!context)
      throw new Error('capture-failed')

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.92)
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError')
      throw new Error('cancelled')

    if (error instanceof DOMException && error.name === 'SecurityError')
      throw new Error('unsupported')

    throw error
  }
  finally {
    stream?.getTracks().forEach(track => track.stop())
  }
}
