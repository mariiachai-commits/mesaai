// GitHub Pages SPA Router Fix
(function() {
  const basePath = '/mesaai';
  const currentPath = window.location.pathname;
  
  // Only process if we're in our GitHub Pages subdirectory
  if (!currentPath.startsWith(basePath)) {
    return;
  }
  
  // Extract the route path from the URL
  const routePath = currentPath.substring(basePath.length);
  
  // If this is a direct access to a route (not the index), redirect through SPA mechanism
  if (routePath !== '/' && routePath !== '' && !routePath.startsWith('/?/')) {
    // Convert direct route access to SPA format
    const spaRoute = routePath.startsWith('/') ? routePath.substring(1) : routePath;
    const newUrl = window.location.origin + basePath + '/?/' + spaRoute + 
                   window.location.search.replace(/&/g, '~and~') + window.location.hash;
    window.location.replace(newUrl);
    return;
  }
  
  // Set up React Router basename fix
  window.__REACT_ROUTER_BASENAME__ = basePath;
  
  // Override history methods to handle basename
  if (typeof window.history !== 'undefined') {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(state, title, url) {
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith(basePath)) {
        url = basePath + url;
      }
      return originalPushState.call(this, state, title, url);
    };
    
    window.history.replaceState = function(state, title, url) {
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith(basePath)) {
        url = basePath + url;
      }
      return originalReplaceState.call(this, state, title, url);
    };
  }
})();
