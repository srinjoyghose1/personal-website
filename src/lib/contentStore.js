import { researchProjects, theses, blogPosts, photos } from '../data/content';
import { contact } from '../data/profile';
import { supabase } from './supabase';

const KEYS = {
  research : 'admin_research',
  blog     : 'admin_blog',
  photos   : 'admin_photos',
  pages    : 'admin_pages',
  about    : 'admin_about',
};

export { KEYS };

const ABOUT_DEFAULTS = {
  intro: `I'm in the Hong Kong SAR this summer, working with Real-World Data at [CUHK's Jockey PHPC](https://www.jockeyphpc.cuhk.edu.hk/en/home).

Studying global markets of science and challenging the status quo on what it means to *"truly"* commercialize saving lives.

I love to stay fit, travel, and meet people. So [reach out](mailto:srinnghose@gmail.com)!`,

  workingOn: `- Real-World Data Research @ [CUHK Jockey PHPC](https://www.jockeyphpc.cuhk.edu.hk/en/home)
- Investment Analyst @ [Balyasny Asset Management](https://www.balyasny.com)
- Organ-on-a-chip research @ [MiNiMedicine Lab](https://minimedicine.seas.upenn.edu)`,

  photos: `*Coming soon* — photos from Hong Kong, Kolkata, and the lab.`,

  places: `*Coming soon* — favorite spots, cities, and places worth visiting.`,

  food: `*Coming soon* — restaurants, street food, and things worth eating.`,
};

const PAGE_DEFAULTS = {
  blog: {
    heading: 'Writing',
    subheading: 'Long-form thinking across biology, bioengineering, and capital markets. Written slowly, read carefully.',
  },
  research: {
    heading: 'Work',
    subheading: 'Bioengineering and wet lab research on one side. Equity research, financial theses, and biotech consulting on the other.',
  },
  photography: {
    heading: 'Photography',
    subheading: '',
  },
};

function read(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('admin_update'));
  supabase
    .from('site_content')
    .upsert({ key, data, updated_at: new Date().toISOString() })
    .then(({ error }) => { if (error) console.warn('Supabase sync failed:', error.message); });
}

export const defaults = {
  research : () => [...researchProjects, ...theses],
  blog     : () => [...blogPosts],
  photos   : () => [...photos],
  pages    : () => ({ ...PAGE_DEFAULTS }),
  about    : () => ({ ...ABOUT_DEFAULTS }),
};

export const store = {
  getResearch  : () => read(KEYS.research, defaults.research()),
  saveResearch : (d) => write(KEYS.research, d),
  getBlog      : () => read(KEYS.blog,     defaults.blog()),
  saveBlog     : (d) => write(KEYS.blog,   d),
  getPhotos    : () => read(KEYS.photos,   defaults.photos()),
  savePhotos   : (d) => write(KEYS.photos, d),
  getPages     : () => read(KEYS.pages,    defaults.pages()),
  savePages    : (d) => write(KEYS.pages,  d),
  getAbout     : () => read(KEYS.about,    defaults.about()),
  saveAbout    : (d) => write(KEYS.about,  d),
  reset        : () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    supabase.from('site_content').delete().in('key', Object.values(KEYS)).then();
    window.dispatchEvent(new Event('admin_update'));
  },
};
