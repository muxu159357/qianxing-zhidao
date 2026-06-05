import { ref, onMounted, onUnmounted } from 'vue'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const MOBILE_MAX = 767
const TABLET_MAX = 1023

export function useBreakpoint() {
  const breakpoint = ref<Breakpoint>(getBreakpoint())

  function getBreakpoint(): Breakpoint {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w <= MOBILE_MAX) return 'mobile'
    if (w <= TABLET_MAX) return 'tablet'
    return 'desktop'
  }

  let timer: ReturnType<typeof setTimeout> | null = null

  function onResize() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { breakpoint.value = getBreakpoint() }, 100)
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    if (timer) clearTimeout(timer)
  })

  return { breakpoint }
}
