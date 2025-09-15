/**
 * Lucide Icons Initialization for BB Design System
 * Automatically replaces data-lucide attributes with proper SVG icons
 */

import { createIcons, icons } from 'lucide';

/**
 * Initialize Lucide icons on page load
 * Scans for elements with data-lucide="icon-name" and replaces them
 */
function initializeLucideIcons() {
  createIcons({
    icons,
    // Add default attributes that work with our semantic tokens
    attrs: {
      class: 'bb-icon',
      stroke: 'currentColor',
      fill: 'none'
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLucideIcons);
} else {
  initializeLucideIcons();
}

// Export for manual initialization
export { initializeLucideIcons };