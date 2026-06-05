import { computed } from 'vue'
import { useBreakpoint } from './useBreakpoint'

export function useIsMobile() {
  const { breakpoint } = useBreakpoint()
  return {
    isMobile: computed(() => breakpoint.value === 'mobile'),
    isTablet: computed(() => breakpoint.value === 'tablet'),
    isDesktop: computed(() => breakpoint.value === 'desktop'),
    breakpoint,
  }
}
