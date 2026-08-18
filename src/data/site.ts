export const SITE_URL = 'https://www.carwashmgmt.com';
export const SITE_NAME = 'Car Wash Management';
export const ORG_NAME = 'Car Wash Management LLC';
export const PHONE = '808-465-2291';
export const PHONE_TEL = '+18084652291';
export const EMAIL = 'info@carwashmgmt.com';
/** A2P / 10DLC customer-care SMS — keyword-only opt-in. Voice line stays 808. */
export const SMS_DISPLAY = '+1 619-914-6819';
export const SMS_E164 = '+16199146819';
export const SMS_KEYWORD = 'START';
export const SMS_HREF = 'sms:+16199146819&body=START';
export const LEGAL_HOME = 'https://legal.carwashmgmt.com/';
export const LEGAL_PRIVACY = 'https://legal.carwashmgmt.com/privacy-policy.html';
export const LEGAL_TERMS = 'https://legal.carwashmgmt.com/terms-and-conditions.html';
export const HOURS = 'Mon–Fri: 9am – 5pm PST';
export const HOURS_FOOTER = 'Mon–Fri: 8am – 6pm PST';
export const DEFAULT_OG =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/a49278099_hero.png';
export const LOGO =
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f163455fdaf19c59586b8/b6e90d7ce_image.png';
export const LOGO_FOOT = LOGO;
export const HERO_HOME =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/a49278099_hero.png';
export const PHOTO_WATER =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/bcc63916d_pexels-nguyendesigner-243971.jpg';
export const PHOTO_FIELD =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/f50cc0d88_image.png';
export const PHOTO_TUNNEL =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/91d199782_pexels-fotios-photos-14513938.jpg';
export const CALENDLY_URL = 'https://calendly.com/andrew-carwashmgmt';

export const SOCIAL = {
  facebook: 'https://www.facebook.com/CarWashManagementLLC',
  linkedin: 'https://www.linkedin.com/company/carwashmgmt/',
  youtube: 'https://www.youtube.com/@CarWashManagementLLC',
  instagram: 'https://www.instagram.com/carwashmgmt',
};

export const NAV = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
      label: 'Services',
      href: '/solutions',
      mega: true,
      items: [
        { label: 'Consultation', href: '/services', desc: 'Operational audits and strategy' },
        { label: 'Equipment', href: '/equipment', desc: 'Install, upgrade, and repair' },
        { label: 'Chemistry', href: '/chemistry', desc: 'Premium chemical programs' },
        {
          label: 'Preventive Maintenance',
          href: '/preventive-maintenance',
          desc: 'Keep tunnels running',
        },
      ],
    },
    {
      label: 'Results',
      href: '/results',
      dropdown: [
        { label: 'Testimonials', href: '/testimonials' },
        { label: 'Case Study', href: '/results' },
      ],
    },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export const BLOG_POSTS = [
  {
    slug: 'reduce-chemical-costs',
    title: 'How to Reduce Chemical Costs at Your Car Wash',
    description: 'Practical ways operators cut chemical spend without hurting wash quality.',
  },
  {
    slug: 'downtime-costs',
    title: 'The Real Cost of Car Wash Downtime',
    description: 'Why unplanned downtime destroys margins and how to prevent it.',
  },
  {
    slug: 'profit-leaks',
    title: 'Profit Leaks Most Car Wash Owners Miss',
    description: 'Hidden cost leaks in water, chemistry, labor, and equipment.',
  },
  {
    slug: 'preventive-maintenance-guide',
    title: 'Preventive Maintenance Guide for Car Washes',
    description: 'A practical PM schedule that reduces breakdowns and extends equipment life.',
  },
  {
    slug: 'how-much-water-does-car-wash-use',
    title: 'How Much Water Does a Car Wash Use?',
    description: 'Water usage benchmarks and how reclaim + nano bubble tech change the math.',
  },
  {
    slug: 'best-car-wash-chemicals-2026',
    title: "Best Car Wash Chemicals 2026 — Buyer's Guide",
    description: 'How to compare tunnel chemistry, dilution, and cost per car without brand theater.',
  },
  {
    slug: 'cost-per-car',
    title: 'What Is Cost Per Car (CPC) and Why It Matters',
    description: 'CPC is the operator scoreboard: chemistry, water, labor, and utilities per vehicle.',
  },
  {
    slug: 'equipment-maintenance-schedule',
    title: 'Car Wash Equipment Maintenance Schedule',
    description: 'Daily, weekly, and monthly checks that keep tunnels running.',
  },
  {
    slug: 'nano-bubble-roi-guide',
    title: 'Nano Bubble Technology: ROI Guide for Operators',
    description: 'How operators evaluate water and chemical savings from nano bubble systems.',
  },
  {
    slug: 'staffing-optimization',
    title: 'Car Wash Staffing Optimization',
    description: 'Lean staffing models that protect service quality without burning out the crew.',
  },
  {
    slug: 'start-car-wash-california',
    title: 'How to Start a Car Wash Business in California',
    description: 'Permits, costs, and operational realities for California wash owners.',
  },
  {
    slug: 'throughput-optimization',
    title: 'Throughput Optimization Without New Equipment',
    description: 'Queue, nozzle, and timing tweaks that raise cars per hour.',
  },
];

export const BLOG_SLUG_MAP: Record<string, string> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, `/blog/${p.slug}`])
);