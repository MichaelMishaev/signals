'use client';
import { cn } from '@/utils/cn';
import React, { ReactElement, Ref, cloneElement, useRef, useState, useEffect } from 'react';

// TEMPORARY: GSAP disabled to fix initialization issues
// Will re-enable after debugging
const GSAP_ENABLED = false;

// Only import GSAP types and modules when enabled
type GSAP = any;
type ScrollTriggerType = any;

interface RevealAnimationProps {
  children: ReactElement<{
    className?: string;
    ref?: Ref<HTMLElement>;
    'data-ns-animate'?: boolean;
  }>;
  duration?: number;
  delay?: number;
  offset?: number;
  instant?: boolean;
  start?: string;
  end?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  useSpring?: boolean;
  rotation?: number;
  animationType?: 'from' | 'to';
  className?: string;
}

const RevealAnimation = ({
  children,
  duration = 0.6,
  delay = 0,
  offset = 60,
  instant = false,
  start = 'top 90%',
  end = 'top 50%',
  direction = 'down',
  useSpring = false,
  rotation = 0,
  animationType = 'from',
  className = '',
}: RevealAnimationProps) => {
  const elementRef = useRef<HTMLElement>(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [gsapInstance, setGsapInstance] = useState<GSAP | null>(null);
  const [scrollTriggerInstance, setScrollTriggerInstance] = useState<ScrollTriggerType | null>(null);

  // When GSAP is disabled, make elements visible immediately
  useEffect(() => {
    if (!GSAP_ENABLED && elementRef.current) {
      // Force elements to be visible when animations are disabled
      elementRef.current.style.opacity = '1';
      elementRef.current.style.filter = 'none';
      elementRef.current.style.transform = 'none';
      return;
    }
  }, []);

  // Lazy load GSAP
  useEffect(() => {
    // Skip GSAP entirely if disabled
    if (!GSAP_ENABLED) return;

    // Only load on client side
    if (typeof window === 'undefined') return;

    loadGSAP()
      .then(({ gsap, ScrollTrigger }) => {
        setGsapInstance(gsap);
        setScrollTriggerInstance(ScrollTrigger);
        setGsapLoaded(true);
      })
      .catch((err) => {
        console.warn('Failed to load GSAP for RevealAnimation, animations disabled:', err);
        // Set loaded to true anyway so component doesn't block rendering
        setGsapLoaded(false);
      });
  }, []);

  // Run animation when GSAP is loaded
  useEffect(() => {
    // Skip animation if GSAP is disabled
    if (!GSAP_ENABLED) return;

    if (!gsapLoaded || !gsapInstance || !scrollTriggerInstance) return;

    const element = elementRef.current;
    if (!element) return;

    // Check if ScrollTrigger is properly initialized
    let scrollTriggerReady = false;
    try {
      scrollTriggerReady = !!(
        scrollTriggerInstance &&
        typeof scrollTriggerInstance.create === 'function' &&
        scrollTriggerInstance.version
      );
    } catch (e) {
      console.warn('ScrollTrigger check failed:', e);
    }

    // If ScrollTrigger is not ready and we need it, use instant animation instead
    const useInstant = instant || !scrollTriggerReady;

    // Get spring easing if useSpring is true
    const spring = useSpring ? Springer.default(0.2, 0.8) : null;

    // Force initial state
    element.style.opacity = '1';
    element.style.filter = 'blur(0)';

    // Set animation properties based on animation type
    let animationProps: Parameters<GSAP['from']>[1];

    if (animationType === 'to') {
      // gsap.to() - animate TO the specified values
      animationProps = {
        opacity: 1,
        filter: 'blur(0)',
        duration: duration,
        delay: delay,
        ease: useSpring && spring ? spring : 'power2.out',
      };

      // Add rotation if specified
      if (rotation !== 0) {
        (animationProps as any).rotation = rotation;
      }
    } else {
      // gsap.from() - animate FROM the specified values to normal
      animationProps = {
        opacity: 0,
        filter: 'blur(16px)',
        duration: duration,
        delay: delay,
        ease: useSpring && spring ? spring : 'power2.out',
      };

      // Add rotation if specified
      if (rotation !== 0) {
        (animationProps as any).rotation = rotation;
      }
    }

    // Add ScrollTrigger only if it's ready and not instant
    if (!useInstant && scrollTriggerReady) {
      try {
        (animationProps as any).scrollTrigger = {
          trigger: element,
          start: start,
          end: end,
          scrub: false,
        };
      } catch (e) {
        console.warn('Failed to add ScrollTrigger, using instant animation:', e);
        // Remove scrollTrigger if it failed
        delete (animationProps as any).scrollTrigger;
      }
    }

    // Set animation direction based on direction prop
    switch (direction) {
      case 'left':
        (animationProps as any).x = animationType === 'from' ? -offset : 0;
        if (animationType === 'to') {
          gsapInstance.set(element, { x: -offset });
        }
        break;
      case 'right':
        (animationProps as any).x = animationType === 'from' ? offset : 0;
        if (animationType === 'to') {
          gsapInstance.set(element, { x: offset });
        }
        break;
      case 'down':
        (animationProps as any).y = animationType === 'from' ? offset : 0;
        if (animationType === 'to') {
          gsapInstance.set(element, { y: offset });
        }
        break;
      case 'up':
      default:
        (animationProps as any).y = animationType === 'from' ? -offset : 0;
        if (animationType === 'to') {
          gsapInstance.set(element, { y: -offset });
        }
        break;
    }

    // Use appropriate GSAP method based on animation type
    let animation;
    if (animationType === 'to') {
      animation = gsapInstance.to(element, animationProps);
    } else {
      animation = gsapInstance.from(element, animationProps);
    }

    // Cleanup function
    return () => {
      if (animation) {
        animation.kill();
      }
      // Kill all ScrollTriggers associated with this element
      if (scrollTriggerInstance && typeof scrollTriggerInstance.getAll === 'function') {
        const triggers = scrollTriggerInstance.getAll();
        triggers.forEach((trigger: any) => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      }
    };
  }, [gsapLoaded, gsapInstance, scrollTriggerInstance, duration, delay, offset, instant, start, end, direction, useSpring, rotation, animationType]);

  // Early return if children is not valid (after all hooks)
  if (!children || !React.isValidElement(children)) {
    if (typeof window !== 'undefined') {
      console.warn('RevealAnimation: Invalid children prop provided');
    }
    return <>{children}</>;
  }

  // Clone the child element and add the ref, className, and data-ns-animate attribute
  return cloneElement(children, {
    ref: elementRef,
    className: cn(children?.props?.className, className),
    'data-ns-animate': true,
  });
};

export default RevealAnimation;
