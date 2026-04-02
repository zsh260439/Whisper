import type { EmojiGroup, GroupAvatarOption, SidebarTab } from '@/types/room'

export const CURRENT_USER_ID = 0

export const DEFAULT_SIGNATURE = '这个人还没有留下签名。'

export const AVATAR_PALETTE = ['#91A896', '#8097AA', '#CAA97F', '#D4A39B', '#8AA1B8', '#C89289', '#7E9D8E', '#A68AC0']

export const SIDEBAR_TABS: SidebarTab[] = [
  { key: 'messages', label: '消息' },
  { key: 'contacts', label: '联系人' },
  { key: 'groups', label: '群聊' },
  { key: 'discover', label: '发现' },
]

export const GROUP_AVATAR_OPTIONS: GroupAvatarOption[] = [
  { label: '群', color: '#91A896' },
  { label: '聊', color: '#8097AA' },
  { label: '友', color: '#CAA97F' },
  { label: '游', color: '#D4A39B' },
  { label: '书', color: '#8AA1B8' },
  { label: '音', color: '#C89289' },
  { label: '影', color: '#7E9D8E' },
  { label: '队', color: '#A68AC0' },
]

export const EMOJI_LIBRARY: EmojiGroup[] = [
  { key: 'smile', label: '笑脸', emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '🥰', '😎', '🥳', '🤩', '😇', '🙂'] },
  { key: 'mood', label: '氛围', emojis: ['😌', '😴', '🤔', '🥺', '😭', '😤', '😮', '😳', '🙃', '🤗', '😏', '😶‍🌫️'] },
  { key: 'hand', label: '手势', emojis: ['👍', '👎', '👏', '🙌', '🤝', '🙏', '✌️', '🤟', '👌', '👀', '💪', '✍️'] },
  { key: 'fun', label: '趣味', emojis: ['🎉', '🎈', '🔥', '✨', '🌈', '☕', '🍉', '🌙', '🌻', '💯', '❤️', '🎵'] },
]
