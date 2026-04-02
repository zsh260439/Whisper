import { AVATAR_PALETTE } from '@/constants/room'
import type { Message } from '@/types/room'

export const createRuntimeId = () =>
  Date.now() + Math.floor(Math.random() * 1000)

export const formatTime = () =>
  new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

export const createGroupId = () =>
  String(Math.floor(100000 + Math.random() * 900000))

export const getAvatarColor = (seed: string) => {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return AVATAR_PALETTE[total % AVATAR_PALETTE.length]
}

export const getAvatarLabel = (name: string, isGroup = false) => {
  if (isGroup)
    return '群'

  return name.trim().slice(0, 1).toUpperCase() || '聊'
}

export const getConversationPreview = (message: Message) => {
  if (message.type === 'image')
    return message.content === '截图' ? '[截图]' : '[图片]'

  return message.content
}

export const getMediaCaption = (message: Message) => {
  if (message.type !== 'image')
    return ''

  return message.content === '截图' ? '' : message.content
}
