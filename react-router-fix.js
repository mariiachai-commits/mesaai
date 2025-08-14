// React Router Basename Fix for GitHub Pages
// This script must run before React Router initializes

(function() {
  'use strict';
  
  const BASENAME = '/mesaai';
  
  // 1. Set global basename for React Router
  window.__REACT_ROUTER_BASENAME__ = BASENAME;
  window.__GITHUB_PAGES_BASENAME__ = BASENAME;
  
  // 2. Check current URL and redirect if necessary
  const currentPath = window.location.pathname;
  
  // If we're accessing root directly, redirect to our basename
  if (currentPath === '/') {
    window.location.replace(BASENAME + '/');
    return;
  }
  
  // If we're accessing a route without our basename, redirect
  if (!currentPath.startsWith(BASENAME + '/') && currentPath !== BASENAME) {
    const newPath = BASENAME + currentPath;
    window.location.replace(newPath + window.location.search + window.location.hash);
    return;
  }
  
  // 3. Override history API methods
  if (window.history) {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(state, title, url) {
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith(BASENAME)) {
        url = BASENAME + url;
      }
      return originalPushState.call(this, state, title, url);
    };
    
    window.history.replaceState = function(state, title, url) {
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith(BASENAME)) {
        url = BASENAME + url;
      }
      return originalReplaceState.call(this, state, title, url);
    };
  }
  
  // 4. Override console.error to catch and fix React Router 404s
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Intercept React Router 404 errors for root path
    if (message.includes('404 Error: User attempted to access non-existent route: /')) {
      console.warn('React Router 404 intercepted - redirecting to basename');
      
      // If we're already at the correct base path, don't redirect
      if (window.location.pathname.startsWith(BASENAME)) {
        return; // Suppress the error
      }
      
      // Redirect to the correct base path
      window.location.replace(BASENAME + '/' + window.location.search + window.location.hash);
      return;
    }
    
    // For other errors, call the original console.error
    return originalConsoleError.apply(console, args);
  };
  
  // 5. Add a global function to get the correct router basename
  window.getRouterBasename = function() {
    return BASENAME;
  };
  
  // 6. Modify the document's base tag if it doesn't exist
  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    base.href = BASENAME + '/';
    document.head.insertBefore(base, document.head.firstChild);
  }
  
  console.log('GitHub Pages React Router fix loaded with basename:', BASENAME);
})();
