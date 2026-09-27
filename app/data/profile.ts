export interface SocialLink {
  name: string
  url: string
  icon: string
  handle: string
}

export const profile = {
  name: 'Syed Haider Hassan',
  firstName: 'Haider',
  initials: 'SH',
  role: 'Full-Stack Engineer',
  currentTitle: 'Frontend Team Lead',
  currentCompany: 'Tile Mountain',
  location: 'Islamabad, Pakistan',
  timezone: 'Asia/Karachi',
  // Public address shown on the site (forwarded to Gmail by Cloudflare Email Routing).
  email: 'hello@haider.pw',
  /** Used to compute "years of experience" so it never goes stale. */
  careerStart: '2012-06',
  resumeUrl: '/resume.pdf',
  /** Square portrait (public/img/avatar.webp); a small copy is used in the home hero. */
  avatar: '/img/avatar.webp' as string | null,
  avatarSmall: '/img/avatar-sm.webp' as string | null,
  siteUrl: 'https://haider.pw',

  tagline: 'I build fast, thoughtful web products — from database to pixel.',
  intro:
    'Full-stack engineer from Islamabad with a decade-plus of shipping PHP, Laravel and Vue applications. Today I lead the frontend team behind a family of headless e-commerce storefronts serving customers across the UK.',

  about: [
    'I started out in 2012 designing layouts in Photoshop and hand-writing HTML and CSS. Curiosity pulled me into PHP, then into frameworks like CodeIgniter and Laravel, and eventually into the modern JavaScript ecosystem with Vue, Nuxt and TypeScript.',
    'Since 2020 I have led the frontend team at Tile Mountain, a UK retailer, where we run several headless storefronts on Vue Storefront with a Magento 2 backend and an Elasticsearch-powered catalog. Alongside the day-to-day engineering I plan and assign work, unblock the team, and own the CI/CD pipelines that ship both the Magento and storefront codebases.',
    'Before that I spent years as a senior PHP engineer building CMSs, crowdfunding platforms, hospital and HR management systems, social communities and large data migrations — often while leading small teams and mentoring junior developers.',
    'I care about clean architecture, performance, and following modern standards and best practices. I like hard problems, fast feedback loops and software that feels good to use.',
  ],

  principles: [
    { icon: 'lucide:gauge', title: 'Performance first', text: 'Fast pages are a feature. I design for speed from the data layer up.' },
    { icon: 'lucide:layers', title: 'Clean architecture', text: 'Readable, well-structured code that the next developer will thank you for.' },
    { icon: 'lucide:users', title: 'Team multiplier', text: 'Leading since 2014 — planning, mentoring and unblocking so the whole team ships.' },
    { icon: 'lucide:rocket', title: 'Ship & automate', text: 'CI/CD, testing and automation so releases are boring — in the best way.' },
  ],

  interests: [
    { icon: 'lucide:gamepad-2', label: 'Video games' },
    { icon: 'lucide:music', label: 'Music' },
    { icon: 'lucide:crown', label: 'Chess' },
    { icon: 'lucide:book-open', label: 'Always learning' },
  ],

  socials: [
    { name: 'GitHub', url: 'https://github.com/haider-pw', icon: 'simple-icons:github', handle: '@haider-pw' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/haider-pw', icon: 'simple-icons:linkedin', handle: 'in/haider-pw' },
  ] satisfies SocialLink[],
}

export interface Education {
  degree: string
  field: string
  school: string
  year: string
}

export const education: Education[] = [
  { degree: 'MS', field: 'Software Engineering', school: 'Abasyn University', year: '2017' },
  { degree: 'BS', field: 'Software Engineering', school: 'City University of Science and Information Technology', year: '2012' },
]
