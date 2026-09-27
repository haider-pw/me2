export interface NavItem {
  label: string
  to: string
  icon: string
}

export const navigation: NavItem[] = [
  { label: 'Home', to: '/', icon: 'lucide:house' },
  { label: 'About', to: '/about', icon: 'lucide:user-round' },
  { label: 'Experience', to: '/work', icon: 'lucide:briefcase-business' },
  { label: 'Projects', to: '/projects', icon: 'lucide:layers' },
  { label: 'Blog', to: '/blog', icon: 'lucide:pen-line' },
  { label: 'Contact', to: '/contact', icon: 'lucide:send' },
]

export function useNavigation() {
  const route = useRoute()
  const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
  return { navigation, isActive }
}
