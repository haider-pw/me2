/** Global open/close state for the ⌘K command palette. */
export function useCommandPalette() {
  const open = useState('command-palette-open', () => false)
  return {
    open,
    toggle: () => { open.value = !open.value },
    show: () => { open.value = true },
    hide: () => { open.value = false },
  }
}
