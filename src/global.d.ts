import type * as AllStores from './stores';
import type { intersections as IntersectionsType } from './intersections'; // Adjust import if necessary

declare global {
  interface Window {
    stores?: typeof AllStores & { intersections: typeof IntersectionsType };
  }
}

// Export something to make it a module, if necessary, though for .d.ts this often isn't strictly needed.
// export {}; 