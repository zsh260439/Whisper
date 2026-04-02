import { useDark, useToggle } from '@vueuse/core'

export const useThemeMode = () => {
  const isDark = useDark({
    selector: 'body',
    attribute: 'class',
    valueDark: 'dark-page',
    valueLight: '',
    storageKey: 'whisper-theme-mode',
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleTheme: () => toggleDark(),
  }
}
