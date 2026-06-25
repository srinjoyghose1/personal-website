import { useState, useEffect } from 'react';
import { store, KEYS } from '../lib/contentStore';
import { supabase } from '../lib/supabase';

function makeHook(getter, supabaseKey) {
  return function useHook() {
    const [data, setData] = useState(getter);

    useEffect(() => {
      // Hydrate from Supabase on mount — overwrites stale localStorage
      supabase
        .from('site_content')
        .select('data')
        .eq('key', supabaseKey)
        .maybeSingle()
        .then(({ data: row }) => {
          if (row?.data) {
            localStorage.setItem(supabaseKey, JSON.stringify(row.data));
            setData(row.data);
          }
        });

      // Same-tab updates dispatched by contentStore
      const onAdminUpdate = () => setData(getter());
      window.addEventListener('admin_update', onAdminUpdate);

      // Cross-browser realtime updates
      const channel = supabase
        .channel(`site_content:${supabaseKey}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_content', filter: `key=eq.${supabaseKey}` },
          (payload) => {
            if (payload.new?.data) {
              localStorage.setItem(supabaseKey, JSON.stringify(payload.new.data));
              setData(payload.new.data);
            }
          }
        )
        .subscribe();

      return () => {
        window.removeEventListener('admin_update', onAdminUpdate);
        supabase.removeChannel(channel);
      };
    }, []);

    return data;
  };
}

export const useResearch = makeHook(store.getResearch, KEYS.research);
export const useBlog     = makeHook(store.getBlog,     KEYS.blog);
export const usePhotos   = makeHook(store.getPhotos,   KEYS.photos);
export const usePages    = makeHook(store.getPages,    KEYS.pages);

// useAbout: loads /about.json (GitHub-editable) as the base, Supabase admin overrides it
export function useAbout() {
  const [data, setData] = useState(store.getAbout);

  useEffect(() => {
    // Load from about.json unless an admin override exists in localStorage
    fetch('/about.json')
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (!json) return;
        const hasAdminOverride = localStorage.getItem(KEYS.about);
        if (!hasAdminOverride) setData(json);
      })
      .catch(() => {});

    // Supabase admin override wins over about.json
    supabase
      .from('site_content')
      .select('data')
      .eq('key', KEYS.about)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.data) {
          localStorage.setItem(KEYS.about, JSON.stringify(row.data));
          setData(row.data);
        }
      });

    const onAdminUpdate = () => setData(store.getAbout());
    window.addEventListener('admin_update', onAdminUpdate);

    const channel = supabase
      .channel(`site_content:${KEYS.about}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content', filter: `key=eq.${KEYS.about}` },
        (payload) => {
          if (payload.new?.data) {
            localStorage.setItem(KEYS.about, JSON.stringify(payload.new.data));
            setData(payload.new.data);
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('admin_update', onAdminUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
