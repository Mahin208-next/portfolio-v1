import { useState, useEffect } from 'react';
import { scrollToElement, scrollToTop } from './smoothScroll';

export function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';

  // Check query parameter search, e.g. ?admin or ?q=/admin
  if (window.location.search) {
    const searchLower = window.location.search.toLowerCase();
    if (searchLower.includes('admin')) {
      window.history.replaceState({}, '', '/admin');
      return '/admin';
    }
  }

  // Clean hash like /#skills or #skills or /#admin or #admin
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();
    if (rawHash === 'admin' || rawHash.startsWith('admin')) {
      window.history.replaceState({}, '', '/admin');
      return '/admin';
    }
    if (rawHash) {
      const cleanPath = '/' + rawHash;
      window.history.replaceState({}, '', cleanPath);
      return cleanPath;
    }
  }

  // Remove trailing slashes and normalize
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const path = rawPath || '/';
  
  if (path === '/admin' || path.startsWith('/admin')) {
    return '/admin';
  }

  if (path === '/home') {
    window.history.replaceState({}, '', '/');
    return '/';
  }

  return path;
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;

  // Clean path format starting with / and removing any hash
  let clean = path.replace(/^#\/?/, '');
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  clean = clean.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/home') {
    clean = '/';
  }

  window.history.pushState({}, '', clean);
  window.dispatchEvent(new Event('popstate'));

  if (clean === '/admin') {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

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
