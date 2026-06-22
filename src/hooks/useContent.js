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
export const useAbout    = makeHook(store.getAbout,    KEYS.about);
