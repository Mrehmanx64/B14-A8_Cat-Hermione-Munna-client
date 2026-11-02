"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from zero the first time it scrolls into view.
 *
 * The server renders the final value so the figure is correct without JS and
 * never shifts after hydration: a hidden copy of the final text reserves the
 * exact width, and the animated copy is laid over it. Screen readers always
 * get the final value, never a mid-count frame.
 */

const DURATION = 1600;

/** Decelerating curve — fast start, gentle settle. */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const format = (value) => Math.round(value).toLocaleString("en-US");

export default function CountUp({ value, suffix = "" }) {
  const finalText = `${format(value)}${suffix}`;
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the OS setting: keep the final figure, skip the motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let startedAt = 0;

    const tick = (now) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min((now - startedAt) / DURATION, 1);
      setDisplay(value * easeOutExpo(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      {/* Reserves the final width so the digits never nudge the layout. */}
      <span aria-hidden="true" className="invisible">
        {finalText}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {format(display)}
        {suffix}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
