import { useState, useEffect, useCallback } from "react";

// ─── Breakpoints ───
// Mobile:  320px - 767px
// Tablet:  768px - 1024px
// Desktop: 1025px+

const MOBILE_MAX = 767;
const TABLET_MAX = 1024;

/**
 * Detect WebGL support once (cached)
 */
let _webglSupport = null;
export function hasWebGL() {
  if (_webglSupport !== null) return _webglSupport;
  try {
    const canvas = document.createElement("canvas");
    _webglSupport = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    _webglSupport = false;
  }
  return _webglSupport;
}

/**
 * Check if device is a touch device (no hover)
 */
export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Get capped device pixel ratio
 * Mobile: max 1.5, Tablet: max 1.75, Desktop: max 2
 */
export function getCappedDPR(width) {
  const raw = window.devicePixelRatio || 1;
  if (width <= MOBILE_MAX) return Math.min(raw, 1.5);
  if (width <= TABLET_MAX) return Math.min(raw, 1.75);
  return Math.min(raw, 2);
}

/**
 * Compute device info from width
 */
function getDeviceInfo(width) {
  return {
    isMobile: width <= MOBILE_MAX,
    isTablet: width > MOBILE_MAX && width <= TABLET_MAX,
    isDesktop: width > TABLET_MAX,
    width,
    isTouchDevice: isTouchDevice(),
    hasWebGL: hasWebGL(),
    cappedDPR: getCappedDPR(width),
  };
}

/**
 * React hook for responsive device detection.
 * Debounces resize to avoid layout thrashing.
 */
export function useDeviceInfo() {
  const [info, setInfo] = useState(() => getDeviceInfo(window.innerWidth));

  const handleResize = useCallback(() => {
    setInfo(getDeviceInfo(window.innerWidth));
  }, []);

  useEffect(() => {
    let timeoutId = null;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return info;
}

/**
 * Throttle a callback to at most once per animation frame
 */
export function rafThrottle(callback) {
  let ticking = false;
  return function throttled(...args) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      callback.apply(this, args);
      ticking = false;
    });
  };
}

/**
 * Throttle a callback to fire at most once every `ms` milliseconds
 */
export function throttle(callback, ms) {
  let lastTime = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastTime >= ms) {
      lastTime = now;
      callback.apply(this, args);
    }
  };
}
