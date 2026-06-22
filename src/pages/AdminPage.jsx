import { useState, useRef, useEffect, useCallback } from 'react';
import { store } from '../lib/contentStore';
import { supabase, BUCKET } from '../lib/supabase';
import { renderMd } from '../lib/markdown';

const GARAMOND = "'Cormorant Garamond', Georgia, serif";
const SANS     = "'DM Sans', system-ui, sans-serif";
const MONO     = "'JetBrains Mono', monospace";

const CREDS = { user: 'srinjoyghose', pass: 'mochidukul55' };

// ─── shared styles ────────────────────────────────────────────────────────────
const input = (extra = {}) => ({
  fontFamily: SANS, fontSize: '0.9rem', fontWeight: 300,
  width: '100%', padding: '10px 14px',
  border: '1px solid #E5E5E5', borderRadius: 8,
  outline: 'none', background: '#fff', color: '#1A1A1A',
  boxSizing: 'border-box',
  ...extra,
});

const label = { fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: '#666', marginBottom: 6, display: 'block' };

const btn = (accent = false, danger = false) => ({
  fontFamily: SANS, fontSize: '0.82rem', letterSpacing: '0.04em',
  textTransform: 'none', fontWeight: 500, padding: '9px 18px', borderRadius: 6,
  border: `1px solid ${danger ? '#ffb3b3' : accent ? '#00BFA6' : '#E5E5E5'}`,
  background: accent ? '#00BFA6' : 'transparent',
  color: accent ? '#fff' : danger ? '#e05050' : '#555',
  cursor: 'pointer', transition: 'all 0.15s',
});

// ─── Field helpers ────────────────────────────────────────────────────────────
function Field({ label: l, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={label}>{l}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={input(mono ? { fontFamily: MONO, fontSize: '0.8rem' } : {})}
    />
  );
}

function TextArea({ value, onChange, rows = 4, placeholder }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      style={{ ...input(), resize: 'vertical', lineHeight: 1.7 }}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)} style={input()}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

function ImageInput({ value, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste image URL…"
          style={{ ...input(), flex: 1 }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} style={btn()}>
          Upload
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value && (
        <img src={value} alt="preview" style={{ height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #E5E5E5' }} />
      )}
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (u === CREDS.user && p === CREDS.pass) onLogin();
    else setErr('Incorrect credentials.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <form onSubmit={submit} style={{ width: 360 }}>
        <p style={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#00BFA6', marginBottom: 12 }}>
          Admin
        </p>
        <h1 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '2.2rem', fontStyle: 'italic', color: '#1A1A1A', marginBottom: 36, lineHeight: 1.1 }}>
          Sign in
        </h1>

        <Field label="Username">
          <TextInput value={u} onChange={setU} placeholder="srinjoyghose" mono />
        </Field>
        <Field label="Password">
          <input
            type="password" value={p} onChange={e => setP(e.target.value)}
            placeholder="••••••••••••"
            style={{ ...input(), fontFamily: MONO }}
          />
        </Field>

        {err && (
          <p style={{ fontFamily: SANS, fontSize: '0.82rem', color: '#e05050', marginBottom: 16 }}>{err}</p>
        )}

        <button type="submit" style={{ ...btn(true), width: '100%', padding: '12px', marginTop: 8 }}>
          Enter dashboard →
        </button>
      </form>
    </div>
  );
}

// ─── Item list row ────────────────────────────────────────────────────────────
function ItemRow({ title, subtitle, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F0F0F0', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.05rem', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
        {subtitle && <p style={{ fontFamily: SANS, fontSize: '0.78rem', color: '#999', letterSpacing: '0.02em', marginTop: 3 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onEdit}   style={btn()}>Edit</button>
        <button onClick={onDelete} style={btn(false, true)}>Delete</button>
      </div>
    </div>
  );
}

const BLOG_CATS_KEY = 'blog_categories';
const DEFAULT_BLOG_CATS = ['Science', 'Finance', 'Systems'];

function loadBlogCats() {
  try {
    const stored = localStorage.getItem(BLOG_CATS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BLOG_CATS;
  } catch { return DEFAULT_BLOG_CATS; }
}

function saveBlogCats(cats) {
  localStorage.setItem(BLOG_CATS_KEY, JSON.stringify(cats));
}

// ─── BLOG EDITOR ──────────────────────────────────────────────────────────────
function BlogEditor({ onClose, initial, onSave, categories, onAddCategory }) {
  const [form, setForm] = useState(initial ?? {
    title: '', date: '', excerpt: '', category: categories[0] ?? 'Science', slug: '',
    photo: '', link: '',
  });
  const [newCat, setNewCat] = useState('');
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const addCategory = () => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onAddCategory(trimmed);
    setForm(f => ({ ...f, category: trimmed }));
    setNewCat('');
  };

  return (
    <div style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 28, marginBottom: 24 }}>
      <h3 style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.3rem', marginBottom: 24 }}>
        {initial ? 'Edit post' : 'New post'}
      </h3>
      <Field label="Title"><TextInput value={form.title} onChange={set('title')} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Date"><TextInput value={form.date} onChange={set('date')} placeholder="2026-04-01" /></Field>
        <Field label="Category">
          <Select value={form.category} onChange={set('category')} options={categories} />
        </Field>
      </div>
      <Field label="Add new category">
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            placeholder="e.g. Philosophy"
            style={{ ...input(), flex: 1 }}
          />
          <button type="button" onClick={addCategory} style={btn()}>Add</button>
        </div>
      </Field>
      <Field label="Slug (URL key)"><TextInput value={form.slug} onChange={set('slug')} mono placeholder="my-post-slug" /></Field>
      <Field label="Cover photo"><ImageInput value={form.photo} onChange={set('photo')} /></Field>
      <Field label="External link (optional)"><TextInput value={form.link} onChange={set('link')} mono placeholder="https://…" /></Field>
      <Field label="Excerpt / full content"><TextArea value={form.excerpt} onChange={set('excerpt')} rows={6} /></Field>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => onSave(form)} style={btn(true)}>Save post</button>
        <button onClick={onClose} style={btn()}>Cancel</button>
      </div>
    </div>
  );
}

// ─── LINKS EDITOR ────────────────────────────────────────────────────────────
function LinksEditor({ value, onChange }) {
  const links = value ?? [];

  const add    = ()       => onChange([...links, { label: '', url: '' }]);
  const remove = (i)      => onChange(links.filter((_, idx) => idx !== i));
  const update = (i, field, val) => onChange(
    links.map((l, idx) => idx === i ? { ...l, [field]: val } : l)
  );

  return (
    <div>
      {links.map((link, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <input
            value={link.label ?? ''}
            onChange={e => update(i, 'label', e.target.value)}
            placeholder="Label"
            style={{ ...input(), flex: '0 0 36%' }}
          />
          <input
            value={link.url ?? ''}
            onChange={e => update(i, 'url', e.target.value)}
            placeholder="https://…"
            style={{ ...input({ fontFamily: MONO, fontSize: '0.8rem' }), flex: 1 }}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            style={{ ...btn(false, true), padding: '9px 12px', flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={{ ...btn(), fontSize: '0.78rem' }}>
        + Add link
      </button>
    </div>
  );
}

// ─── WORK EDITOR ─────────────────────────────────────────────────────────────
function WorkEditor({ onClose, initial, onSave }) {
  const [form, setForm] = useState(initial ?? {
    title: '', date: '', abstract: '', category: 'Research',
    findings: '', institution: '', photo: '', link: '', published: false,
    links: [],
  });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 28, marginBottom: 24 }}>
      <h3 style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.3rem', marginBottom: 24 }}>
        {initial ? 'Edit item' : 'New item'}
      </h3>

      {/* Published toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: form.published ? 'rgba(0,191,166,0.06)' : '#F0F0F0', border: `1px solid ${form.published ? 'rgba(0,191,166,0.3)' : '#E0E0E0'}`, transition: 'all 0.2s' }}>
        <button
          type="button"
          onClick={() => set('published')(!form.published)}
          style={{
            width: 44, height: 24, borderRadius: 12,
            background: form.published ? '#00BFA6' : '#CCC',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 3,
            left: form.published ? 23 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
        <div>
          <p style={{ fontFamily: MONO, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: form.published ? '#00BFA6' : '#999', margin: 0 }}>
            {form.published ? 'Published — visible with underline' : 'Draft — no underline on card'}
          </p>
        </div>
      </div>

      <Field label="Title"><TextInput value={form.title} onChange={set('title')} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Date"><TextInput value={form.date} onChange={set('date')} placeholder="2026-01" /></Field>
        <Field label="Category">
          <Select value={form.category} onChange={set('category')}
            options={['Research', 'Projects', 'Investment Theses', 'Community']} />
        </Field>
      </div>
      <Field label="Institution / Org"><TextInput value={form.institution} onChange={set('institution')} /></Field>
      <Field label="Abstract"><TextArea value={form.abstract} onChange={set('abstract')} rows={4} /></Field>
      <Field label="Findings / Details"><TextArea value={form.findings} onChange={set('findings')} rows={4} /></Field>
      <Field label="Photo"><ImageInput value={form.photo} onChange={set('photo')} /></Field>
      <Field label="Link (URL)"><TextInput value={form.link} onChange={set('link')} placeholder="https://…" mono /></Field>
      <Field label="Quick links (shown on double-click in card)">
        <LinksEditor value={form.links} onChange={set('links')} />
      </Field>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => onSave(form)} style={btn(true)}>Save item</button>
        <button onClick={onClose} style={btn()}>Cancel</button>
      </div>
    </div>
  );
}

// ─── PHOTO EDITOR ────────────────────────────────────────────────────────────
function PhotoEditor({ onClose, initial, onSave }) {
  const [form, setForm] = useState(initial ?? {
    title: '', date: '', location: '', aspect: 'square', imageUrl: '',
  });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 28, marginBottom: 24 }}>
      <h3 style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.3rem', marginBottom: 24 }}>
        {initial ? 'Edit photo' : 'New photo'}
      </h3>
      <Field label="Title"><TextInput value={form.title} onChange={set('title')} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Field label="Date"><TextInput value={form.date} onChange={set('date')} placeholder="2026-01-01" /></Field>
        <Field label="Location"><TextInput value={form.location} onChange={set('location')} /></Field>
        <Field label="Aspect">
          <Select value={form.aspect} onChange={set('aspect')} options={['square', 'tall', 'wide']} />
        </Field>
      </div>
      <Field label="Photo"><ImageInput value={form.imageUrl} onChange={set('imageUrl')} /></Field>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => onSave(form)} style={btn(true)}>Save photo</button>
        <button onClick={onClose} style={btn()}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Tab sections ─────────────────────────────────────────────────────────────
function BlogSection() {
  const [items,      setItems]      = useState(store.getBlog);
  const [editing,    setEditing]    = useState(null);
  const [saved,      setSaved]      = useState(false);
  const [categories, setCategories] = useState(loadBlogCats);

  const addCategory = (cat) => {
    const next = [...categories, cat];
    setCategories(next);
    saveBlogCats(next);
  };

  const save = (form) => {
    const next = editing === 'new'
      ? [...items, { ...form, id: Date.now() }]
      : items.map(i => i.id === editing.id ? { ...editing, ...form } : i);
    store.saveBlog(next);
    setItems(next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const del = (id) => {
    const next = items.filter(i => i.id !== id);
    store.saveBlog(next);
    setItems(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic' }}>Blog posts</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>Saved ✓</span>}
          <button onClick={() => setEditing('new')} style={btn(true)}>+ New post</button>
        </div>
      </div>

      {editing === 'new' && (
        <BlogEditor onClose={() => setEditing(null)} onSave={save} categories={categories} onAddCategory={addCategory} />
      )}

      {items.map(item => (
        <div key={item.id}>
          {editing?.id === item.id && (
            <BlogEditor initial={item} onClose={() => setEditing(null)} onSave={save} categories={categories} onAddCategory={addCategory} />
          )}
          {editing?.id !== item.id && (
            <ItemRow
              title={item.title}
              subtitle={[item.date, item.category].filter(Boolean).join(' · ')}
              onEdit={() => setEditing(item)}
              onDelete={() => del(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function WorkSection() {
  const [items,   setItems]   = useState(store.getResearch);
  const [editing, setEditing] = useState(null);
  const [saved,   setSaved]   = useState(false);

  const save = (form) => {
    const next = editing === 'new'
      ? [...items, { ...form, id: Date.now() }]
      : items.map(i => i.id === editing.id ? { ...editing, ...form } : i);
    store.saveResearch(next);
    setItems(next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const del = (id) => {
    const next = items.filter(i => i.id !== id);
    store.saveResearch(next);
    setItems(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic' }}>Work items</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>Saved ✓</span>}
          <button onClick={() => setEditing('new')} style={btn(true)}>+ New item</button>
        </div>
      </div>

      {editing === 'new' && (
        <WorkEditor onClose={() => setEditing(null)} onSave={save} />
      )}

      {items.map(item => (
        <div key={item.id}>
          {editing?.id === item.id && (
            <WorkEditor initial={item} onClose={() => setEditing(null)} onSave={save} />
          )}
          {editing?.id !== item.id && (
            <ItemRow
              title={item.title}
              subtitle={`${item.date} · ${item.category}${item.institution ? ' · ' + item.institution : ''}${item.published ? ' · Published ✓' : ' · Draft'}`}
              onEdit={() => setEditing(item)}
              onDelete={() => del(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PhotosSection() {
  const [items,    setItems]   = useState(store.getPhotos);
  const [editing,  setEditing] = useState(null);
  const [saved,    setSaved]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const bulkRef = useRef(null);

  const persist = (next) => {
    store.savePhotos(next);
    setItems(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const save = (form) => {
    const next = editing === 'new'
      ? [...items, { ...form, id: Date.now() }]
      : items.map(i => i.id === editing.id ? { ...editing, ...form } : i);
    persist(next);
    setEditing(null);
  };

  const del = (id) => persist(items.filter(i => i.id !== id));

  const readFiles = (files) => {
    const imageFiles = [...files].filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    let count = 0;
    const newEntries = [];
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        newEntries.push({ id: Date.now() + Math.random(), title: name, date: '', location: '', aspect: 'square', imageUrl: ev.target.result });
        count++;
        if (count === imageFiles.length) {
          const next = [...items, ...newEntries];
          persist(next);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    readFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic' }}>Photography</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>Saved ✓</span>}
          <button onClick={() => bulkRef.current?.click()} style={btn()}>Upload batch</button>
          <button onClick={() => setEditing('new')} style={btn(true)}>+ Add one</button>
        </div>
      </div>

      {/* Hidden bulk file input */}
      <input
        ref={bulkRef} type="file" accept="image/*" multiple
        style={{ display: 'none' }}
        onChange={e => { readFiles(e.target.files); e.target.value = ''; }}
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => bulkRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#00BFA6' : '#D8D8D8'}`,
          borderRadius: 10,
          padding: '28px 20px',
          textAlign: 'center',
          marginBottom: 24,
          cursor: 'pointer',
          background: dragging ? 'rgba(0,191,166,0.04)' : 'transparent',
          transition: 'all 0.15s',
        }}
      >
        <p style={{ fontFamily: SANS, fontSize: '0.9rem', color: '#999', margin: 0 }}>
          Drop images here or click to select — upload many at once
        </p>
      </div>

      {/* Thumbnail grid preview */}
      {items.filter(p => p.imageUrl).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 24 }}>
          {items.filter(p => p.imageUrl).map(p => (
            <img key={p.id} src={p.imageUrl} alt={p.title}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 5, border: '1px solid #E5E5E5' }} />
          ))}
        </div>
      )}

      {editing === 'new' && (
        <PhotoEditor onClose={() => setEditing(null)} onSave={save} />
      )}

      {items.map(item => (
        <div key={item.id}>
          {editing?.id === item.id && (
            <PhotoEditor initial={item} onClose={() => setEditing(null)} onSave={save} />
          )}
          {editing?.id !== item.id && (
            <ItemRow
              title={item.title}
              subtitle={[item.date, item.location, item.aspect].filter(Boolean).join(' · ')}
              onEdit={() => setEditing(item)}
              onDelete={() => del(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PAGES SECTION ────────────────────────────────────────────────────────────
const PAGE_LABELS = [
  { key: 'blog',     name: 'Writing page' },
  { key: 'research', name: 'Work page'    },
];

function PagesSection() {
  const [pages, setPages] = useState(store.getPages);
  const [saved, setSaved] = useState(false);

  const setField = (pageKey, field) => (val) => {
    setPages(p => ({ ...p, [pageKey]: { ...p[pageKey], [field]: val } }));
  };

  const saveAll = () => {
    store.savePages(pages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic' }}>Page content</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>Saved ✓</span>}
          <button onClick={saveAll} style={btn(true)}>Save all</button>
        </div>
      </div>

      {PAGE_LABELS.map(({ key, name }) => (
        <div key={key} style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <p style={{ ...label, fontSize: '0.78rem', color: '#555', marginBottom: 16 }}>{name}</p>
          <Field label="Page heading">
            <TextInput value={pages[key]?.heading ?? ''} onChange={setField(key, 'heading')} />
          </Field>
          <Field label="Subheading / description">
            <TextArea value={pages[key]?.subheading ?? ''} onChange={setField(key, 'subheading')} rows={3} placeholder="Leave blank to hide" />
          </Field>
        </div>
      ))}
    </div>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function MdPreview({ text }) {
  if (!text) return null;
  return (
    <div
      style={{
        background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 8,
        padding: '14px 18px', marginTop: 8,
        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', lineHeight: 1.7,
        color: '#555',
      }}
      dangerouslySetInnerHTML={{ __html: renderMd(text) }}
    />
  );
}

const ABOUT_HINT = {
  display: 'block',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.68rem',
  letterSpacing: '0.08em',
  color: '#aaa',
  marginTop: 6,
};

function AboutSection() {
  const [data,    setData]    = useState(store.getAbout);
  const [saved,   setSaved]   = useState(false);
  const [preview, setPreview] = useState(null);

  const set = (key) => (val) => setData(d => ({ ...d, [key]: val }));

  const saveAll = () => {
    store.saveAbout(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const mdFields = [
    {
      key: 'intro',
      label: 'Intro paragraphs',
      hint: 'Supports **bold**, *italic*, [link text](url). Blank lines = new paragraph.',
      rows: 7,
    },
    {
      key: 'workingOn',
      label: 'What I\'m working on',
      hint: 'Use "- item" for bullet points. Links: [label](url).',
      rows: 5,
    },
  ];

  const elseFields = [
    { key: 'photos', label: 'Everything else → Photos', rows: 4 },
    { key: 'places', label: 'Everything else → Places', rows: 4 },
    { key: 'food',   label: 'Everything else → Food',   rows: 4 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic', margin: 0 }}>
            "hi im srinjoy" page
          </h2>
          <p style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#999', margin: '6px 0 0' }}>
            Edit all content in markdown. Changes appear live on the /all page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>Saved ✓</span>}
          <button onClick={saveAll} style={btn(true)}>Save all</button>
        </div>
      </div>

      {/* Main markdown fields */}
      {mdFields.map(({ key, label, hint, rows }) => (
        <div key={key} style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <Field label={label}>
            <textarea
              value={data[key] ?? ''}
              onChange={e => set(key)(e.target.value)}
              rows={rows}
              style={{
                ...input(), resize: 'vertical', lineHeight: 1.7,
                fontFamily: MONO, fontSize: '0.82rem',
              }}
            />
            {hint && <span style={ABOUT_HINT}>{hint}</span>}
          </Field>
          <button
            type="button"
            onClick={() => setPreview(prev => prev === key ? null : key)}
            style={{ ...btn(), fontSize: '0.75rem', marginTop: 4 }}
          >
            {preview === key ? 'Hide preview' : 'Preview'}
          </button>
          {preview === key && <MdPreview text={data[key]} />}
        </div>
      ))}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E5E5E5', margin: '24px 0', paddingTop: 24 }}>
        <p style={{ ...label, fontSize: '0.8rem', color: '#555', marginBottom: 16 }}>
          "Everything else" sub-sections
        </p>
        <p style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#aaa', marginBottom: 20, lineHeight: 1.6 }}>
          These appear as expandable sub-sections under the "everything else" accordion on the page. Use markdown — headings (#, ##), lists (- item), links ([text](url)), **bold**, *italic*.
        </p>
      </div>

      {/* Everything else fields */}
      {elseFields.map(({ key, label: elseLabel, rows }) => (
        <div key={key} style={{ background: '#F9FAFB', border: '1px solid #E5E5E5', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <Field label={elseLabel}>
            <textarea
              value={data[key] ?? ''}
              onChange={e => set(key)(e.target.value)}
              rows={rows}
              style={{
                ...input(), resize: 'vertical', lineHeight: 1.7,
                fontFamily: MONO, fontSize: '0.82rem',
              }}
            />
          </Field>
          <button
            type="button"
            onClick={() => setPreview(prev => prev === key ? null : key)}
            style={{ ...btn(), fontSize: '0.75rem', marginTop: 4 }}
          >
            {preview === key ? 'Hide preview' : 'Preview'}
          </button>
          {preview === key && <MdPreview text={data[key]} />}
        </div>
      ))}
    </div>
  );
}

// ─── ALBUM SECTION (Supabase-backed camera roll) ──────────────────────────────
function AlbumSection() {
  const [photos,   setPhotos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState('');
  const [dragging, setDragging] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef(null);

  const flash = (msg, ms = 2400) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), ms);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 200, offset: 0, sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) { flash('Failed to load album.'); setLoading(false); return; }
    const imgs = (data ?? []).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f.name));
    setPhotos(imgs.map(f => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? 0,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadFiles = useCallback(async (files) => {
    const imgs = [...files].filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return;
    flash(`Uploading ${imgs.length} photo${imgs.length > 1 ? 's' : ''}…`);
    let ok = 0;
    await Promise.all(imgs.map(async (file) => {
      const name = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
        contentType: file.type, upsert: false,
      });
      if (!error) ok++;
    }));
    flash(`${ok} of ${imgs.length} uploaded ✓`);
    load();
  }, [load]);

  const deletePhoto = useCallback(async (name) => {
    setDeleting(name);
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    setDeleting(null);
    if (error) { flash('Delete failed.'); return; }
    setPhotos(prev => prev.filter(p => p.name !== name));
    flash('Deleted.');
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.8rem', fontStyle: 'italic' }}>Camera album</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {status && <span style={{ fontFamily: SANS, fontSize: '0.8rem', color: '#00BFA6', fontWeight: 500 }}>{status}</span>}
          <button onClick={load} style={btn()}>Refresh</button>
          <button onClick={() => fileRef.current?.click()} style={btn(true)}>+ Upload photos</button>
        </div>
      </div>

      <input
        ref={fileRef} type="file" accept="image/*" multiple
        style={{ display: 'none' }}
        onChange={e => { uploadFiles(e.target.files); e.target.value = ''; }}
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#00BFA6' : '#D8D8D8'}`,
          borderRadius: 10, padding: '28px 20px',
          textAlign: 'center', marginBottom: 28,
          cursor: 'pointer',
          background: dragging ? 'rgba(0,191,166,0.04)' : 'transparent',
          transition: 'all 0.15s',
        }}
      >
        <p style={{ fontFamily: SANS, fontSize: '0.9rem', color: '#999', margin: 0 }}>
          {loading ? 'Loading album…' : 'Drop photos here or click to upload — syncs to the 3D camera gallery'}
        </p>
      </div>

      {/* Photo grid */}
      {!loading && photos.length === 0 && (
        <p style={{ fontFamily: SANS, fontSize: '0.9rem', color: '#aaa', textAlign: 'center', padding: '40px 0' }}>
          No photos yet — upload some above.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {photos.map(p => (
          <div key={p.name} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E5E5', background: '#F5F5F5' }}>
            <img
              src={p.url}
              alt={p.name}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: 6,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.38)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
            >
              <button
                onClick={() => deletePhoto(p.name)}
                disabled={deleting === p.name}
                style={{
                  fontFamily: MONO, fontSize: '0.58rem', letterSpacing: '0.1em',
                  padding: '5px 10px', borderRadius: 5,
                  border: '1px solid rgba(255,100,100,0.7)',
                  background: 'rgba(0,0,0,0.65)',
                  color: deleting === p.name ? '#888' : '#ff8080',
                  cursor: deleting === p.name ? 'default' : 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                {deleting === p.name ? '…' : 'Delete'}
              </button>
            </div>
            <p style={{
              fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.08em',
              color: '#aaa', margin: 0, padding: '4px 6px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {p.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'about',  label: 'About page'   },
  { id: 'blog',   label: 'Writing'      },
  { id: 'work',   label: 'Work'         },
  { id: 'photos', label: 'Photography'  },
  { id: 'pages',  label: 'Page headers' },
  { id: 'album',  label: 'Camera album' },
];

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('about');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FAFAFA' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #E5E5E5', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <p style={{ fontFamily: MONO, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00BFA6', marginBottom: 28 }}>
          Admin
        </p>
        <p style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: '1.5rem', fontStyle: 'italic', color: '#1A1A1A', marginBottom: 32, lineHeight: 1.1 }}>
          Dashboard
        </p>

        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            fontFamily: SANS, fontSize: '0.88rem', fontWeight: tab === t.id ? 500 : 300,
            color: tab === t.id ? '#00BFA6' : '#888',
            background: tab === t.id ? 'rgba(0,191,166,0.07)' : 'transparent',
            border: 'none', borderRadius: 8,
            padding: '10px 14px', textAlign: 'left',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button onClick={() => { store.reset(); window.location.reload(); }}
          style={{ ...btn(false, false), textAlign: 'left', marginBottom: 8, color: '#bbb', borderColor: '#f0f0f0' }}>
          Reset to defaults
        </button>
        <button onClick={onLogout} style={{ ...btn(), textAlign: 'left' }}>
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '48px 56px', maxWidth: 860, overflowY: 'auto' }}>
        {tab === 'about'  && <AboutSection />}
        {tab === 'blog'   && <BlogSection />}
        {tab === 'work'   && <WorkSection />}
        {tab === 'photos' && <PhotosSection />}
        {tab === 'pages'  && <PagesSection />}
        {tab === 'album'  && <AlbumSection />}
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('admin_auth') === '1'
  );

  const login  = () => { sessionStorage.setItem('admin_auth', '1'); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem('admin_auth');    setAuthed(false); };

  return authed ? <Dashboard onLogout={logout} /> : <Login onLogin={login} />;
}
