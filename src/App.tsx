/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { useCurrentPath, navigateTo } from './utils/router';
import { initSmoothScroll, destroySmoothScroll } from './utils/smoothScroll';
import { BeamsBackground } from './components/ui/beams-background';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/admin/AdminPanel';

function MainApp() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { currentPath } = useCurrentPath();

  // Initialize Lenis smooth scroll for butter-smooth inertia scrolling
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to section when visiting clean paths like /skills, /about, /projects
  useEffect(() => {
    if (currentPath && currentPath !== '/' && currentPath !== '/home' && currentPath !== '/admin') {
      const sectionId = currentPath.replace('/', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else if (currentPath === '/' || currentPath === '/home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPath]);

  // When visiting /admin
  if (currentPath === '/admin') {
    return (
      <BeamsBackground
        darkMode={darkMode}
        className={`min-h-screen ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
      >
        <AdminPanel
          onBackToSite={() => navigateTo('/')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </BeamsBackground>
    );
  }

  return (
    <BeamsBackground
      darkMode={darkMode}
      className={`min-h-screen font-sans selection:bg-amber-400 selection:text-zinc-950 transition-colors duration-300 ${
        darkMode ? 'text-zinc-100' : 'text-zinc-900'
      }`}
    >
      <div className="relative z-10">
        {/* Top Bar Navigation */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Main Portfolio Sections */}
        <main>
          {/* Kinetic Hero */}
          <Hero />

          {/* 01. About Me */}
          <About />

          {/* 02. Skills Matrix */}
          <Skills />

          {/* 03. Work Experiences */}
          <Experience />

          {/* 04. Projects */}
          <Projects />

          {/* 05. Education */}
          <Education />

          {/* 06. Blog */}
          <Blog />

          {/* 07. Contact */}
          <Contact />
        </main>

        {/* Footer Colophon with Admin Link */}
        <Footer />
      </div>
    </BeamsBackground>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainApp />
    </PortfolioProvider>
  );
}
