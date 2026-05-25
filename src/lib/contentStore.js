import { researchProjects, theses, blogPosts, photos } from '../data/content';

const KEYS = {
  research : 'admin_research',
  blog     : 'admin_blog',
  photos   : 'admin_photos',
  pages    : 'admin_pages',
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
}

export const defaults = {
  research : () => [...researchProjects, ...theses],
  blog     : () => [...blogPosts],
  photos   : () => [...photos],
  pages    : () => ({ ...PAGE_DEFAULTS }),
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
  reset        : () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event('admin_update'));
  },
};
