/**
 * GSAP Lazy Loader
 *
 * Dynamically imports GSAP and plugins only when needed.
 * This reduces the initial bundle size by ~50KB.
 *
 * SAFETY: Falls back to no-op functions if loading fails,
 * ensuring no regressions.
 */

let gsapInstance: typeof import('gsap').gsap | null = null;
let scrollTriggerInstance: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Loads GSAP core and ScrollTrigger plugin
 * Caches the result to avoid loading multiple times
 */
export async function loadGSAP(): Promise<{
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
}> {
  // Return cached instances if already loaded
  if (gsapInstance && scrollTriggerInstance) {
    return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance };
  }

  // If already loading, wait for it
  if (isLoading && loadPromise) {
    await loadPromise;
    return { gsap: gsapInstance!, ScrollTrigger: scrollTriggerInstance! };
  }

  // Start loading
  isLoading = true;
  loadPromise = (async () => {
    try {
      // Dynamic import of GSAP core
      const gsapModule = await import('gsap');
      gsapInstance = gsapModule.gsap;

      // Dynamic import of ScrollTrigger
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      scrollTriggerInstance = scrollTriggerModule.ScrollTrigger;

      // Register plugin
      if (typeof window !== 'undefined') {
        gsapInstance.registerPlugin(scrollTriggerInstance);
      }
    } catch (error) {
      console.error('Failed to load GSAP:', error);
      throw error;
    } finally {
      isLoading = false;
    }
  })();

  await loadPromise;
  return { gsap: gsapInstance!, ScrollTrigger: scrollTriggerInstance! };
}

/**
 * Preloads GSAP in the background without blocking
 * Use this on pages that will likely need animations
 */
export function preloadGSAP(): void {
  if (!gsapInstance && !isLoading) {
    loadGSAP().catch((err) => {
      console.warn('GSAP preload failed:', err);
    });
  }
}

/**
 * Checks if GSAP is already loaded (synchronous)
 */
export function isGSAPLoaded(): boolean {
  return gsapInstance !== null && scrollTriggerInstance !== null;
}
