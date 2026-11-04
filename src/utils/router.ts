import { useState, useEffect } from 'react';
import { scrollToElement, scrollToTop } from './smoothScroll';

export function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';
  
  // Clean hash like /#skills or #skills if present
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (rawHash) {
      const cleanPath = '/' + rawHash.toLowerCase();
      window.history.replaceState({}, '', cleanPath);
      return cleanPath;
    }
  }

  const path = window.location.pathname.toLowerCase();
  return path || '/';
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;

  // Clean path format starting with / and removing any hash
  let clean = path.replace(/^#\/?/, '');
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  clean = clean.toLowerCase();

  window.history.pushState({}, '', clean);
  window.dispatchEvent(new Event('popstate'));

  // If path corresponds to home or root
  if (clean === '/' || clean === '/home') {
    scrollToTop();
    return;
  }

  // If path corresponds to a section on the main page
  const sectionId = clean.replace('/', '');
  if (sectionId && sectionId !== 'admin') {
    const el = document.getElementById(sectionId);
    if (el) {
      scrollToElement(el, -80);
    }
  }
}

export function useCurrentPath() {
  const [currentPath, setCurrentPath] = useState(getCleanPath());

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(getCleanPath());
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return { currentPath, navigate: navigateTo };
}
