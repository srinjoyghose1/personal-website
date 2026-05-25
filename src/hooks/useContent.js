import { useState, useEffect } from 'react';
import { store } from '../lib/contentStore';

function makehook(getter) {
  return function useHook() {
    const [data, setData] = useState(getter);
    useEffect(() => {
      const h = () => setData(getter());
      window.addEventListener('admin_update', h);
      return () => window.removeEventListener('admin_update', h);
    }, []);
    return data;
  };
}

export const useResearch = makehook(store.getResearch);
export const useBlog     = makehook(store.getBlog);
export const usePhotos   = makehook(store.getPhotos);
export const usePages    = makehook(store.getPages);
