export interface Experience {
  id: string
  company: string
  role: string
  location: string
  /** YYYY-MM */
  start: string
  /** YYYY-MM, or null when this is the current role */
  end: string | null
  logo: string | null
  url?: string
  summary: string
  highlights: string[]
  stack: string[]
}

/** Most recent first. */
export const experience: Experience[] = [
  {
    id: 'tilemountain',
    company: 'Tile Mountain',
    role: 'Frontend Team Lead',
    location: 'Remote · UK',
    start: '2020-06',
    end: null,
    logo: '/img/work/tilemountain.png',
    url: 'https://www.tilemountain.co.uk',
    summary:
      'Leading a remote frontend team building the company’s headless e-commerce storefronts on Vue Storefront, with Magento 2 as the commerce backend.',
    highlights: [
      'Lead the frontend team day to day — planning and assigning work in Jira and ClickUp, reviewing code and unblocking engineers on Vue.js problems.',
      'Shipped and maintain four storefronts — Tile Mountain, Tiles247, Bathroom Mountain and Walls and Floors — on a shared Vue Storefront 1.x codebase.',
      'Catalog indexed in Elasticsearch so the storefront no longer queries Magento on every request, improving speed, scalability and maintainability.',
      'Set up CI/CD for both the Magento and Vue Storefront applications, automating testing and deployments.',
      'Driving the migration from Vue Storefront 1.x (Vue 2) to Vue Storefront 2, built on Nuxt 3.',
    ],
    stack: ['Vue.js', 'Nuxt', 'Vue Storefront', 'TypeScript', 'Magento 2', 'Elasticsearch', 'GraphQL', 'CI/CD'],
  },
  {
    id: 'creativetech',
    company: 'Creativetech Solutions',
    role: 'Senior Full-Stack Engineer',
    location: 'Islamabad',
    start: '2016-05',
    end: '2020-05',
    logo: '/img/work/creative.webp',
    summary:
      'Built and maintained PHP products for international clients using CodeIgniter 3 and Laravel 5, plus custom Joomla and JomSocial work.',
    highlights: [
      'Built a CodeIgniter 3 CMS for ESIC Directory with a page builder, investor/company listings, role management and year-wise questionnaires.',
      'Part of an 8-person team building Billfolda, an equity-crowdfunding platform for an Australian client, and upgraded it from Laravel 5.4 to 5.5.',
      'Migrated the Hairlista community off Ning onto JomSocial, writing PHP importers for multi-gigabyte JSON exports plus all images and videos.',
      'Integrated third-party APIs (GitHub, Bitbucket, Facebook, MongoDB and more) and built a GitHub/Bitbucket OAuth plugin for JomSocial.',
      'Kept production healthy on AWS EC2 / Elastic Beanstalk, with CI/CD on Semaphore in an agile, Jira-driven workflow.',
    ],
    stack: ['PHP', 'Laravel', 'CodeIgniter', 'MySQL', 'Joomla', 'AWS', 'Semaphore CI', 'Jira'],
  },
  {
    id: 'parexons',
    company: 'Parexons',
    role: 'Senior PHP Developer & Team Lead',
    location: 'Peshawar',
    start: '2014-12',
    end: '2016-05',
    logo: '/img/work/parexons-96.webp',
    summary:
      'Joined as a senior PHP developer and grew into team lead, delivering everything from small websites to large products — mostly CodeIgniter on MySQL.',
    highlights: [
      'Team lead and operations manager for PHIMS, later PRaHMIS — a patient-record and hospital management system that started under my supervision.',
      'Raised the code quality of an in-house HR management system and added new modules.',
      'Led interns and junior developers, splitting project workloads and assigning tasks to match each person’s strengths.',
      'Delivered WordPress sites such as Stytech and Explorer alongside the core products.',
    ],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'WordPress', 'jQuery'],
  },
  {
    id: 'smart-bakhtar',
    company: 'Smart Bakhtar Solutions',
    role: 'Senior PHP Developer & Design Team Lead',
    location: 'Peshawar',
    start: '2013-01',
    end: '2014-09',
    logo: null,
    summary:
      'Started as a senior web designer, moved into PHP development and ended up holding two roles: design team lead and senior PHP developer.',
    highlights: [
      'Led the design team on sites including Khana-e-Noor, Baran Hotel, Bost University and Afghan Folad.',
      'Grew into a senior developer on Zorkif ERP (CodeIgniter 2) for a Saudi client, working with a four-person team across modules.',
      'Picked up CodeIgniter, Kendo UI and server-side DataTables to build data-heavy business applications.',
    ],
    stack: ['PHP', 'CodeIgniter', 'Kendo UI', 'DataTables', 'HTML/CSS'],
  },
  {
    id: 'telic',
    company: 'Telic Technologies',
    role: 'Frontend Developer (Intern)',
    location: 'Peshawar',
    start: '2012-06',
    end: '2012-12',
    logo: null,
    summary:
      'Where it all began: designing and building responsive websites, plus brochures, catalogues and PSD layouts.',
    highlights: [
      'Turned Photoshop designs into responsive, mobile-friendly websites with HTML, CSS and Bootstrap.',
      'Designed the UI for a .NET web application with continuous integration on Team Foundation Server.',
    ],
    stack: ['HTML', 'CSS', 'Bootstrap', 'Photoshop'],
  },
]
