'use client';

import { useEffect, useRef } from 'react';

interface GSAPAnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export const useGSAP = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const animateIn = (options: GSAPAnimationOptions = {}) => {
    const { duration = 0.6, delay = 0, ease = "power2.out" } = options;
    
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease,
        }
      );
    }
  };

  const animateStagger = (selector: string, options: GSAPAnimationOptions = {}) => {
    const { duration = 0.4, delay = 0, ease = "power2.out", stagger = 0.1 } = options;
    
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.fromTo(
        selector,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease,
          stagger,
        }
      );
    }
  };

  const animateCard = (index: number, options: GSAPAnimationOptions = {}) => {
    const { duration = 0.5, ease = "power2.out" } = options;
    
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay: index * 0.1,
          ease,
        }
      );
    }
  };

  const animateSidebar = (isOpen: boolean) => {
    if (typeof window !== 'undefined' && window.gsap) {
      if (isOpen) {
        window.gsap.fromTo(
          elementRef.current,
          {
            x: -300,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          }
        );
      } else {
        window.gsap.to(elementRef.current, {
          x: -300,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  };

  const animateStats = (index: number) => {
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  };

  return {
    elementRef,
    animateIn,
    animateStagger,
    animateCard,
    animateSidebar,
    animateStats,
  };
};

// Extend Window interface for GSAP
declare global {
  interface Window {
    gsap: any;
  }
} 