"use client";

import { useState } from "react";

const initialsOf = (name = "", email = "") => {
  const source = name.trim() || email.trim();
  if (!source) return "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

/**
 * Avatar with a graceful fallback: broken image URLs fall back to initials
 * rather than showing a broken-image icon.
 */
export default function UserAvatar({ user, size = 40, className = "" }) {
  const [broken, setBroken] = useState(false);
  const src = user?.image?.trim();
  const showImage = Boolean(src) && !broken;

  const style = { width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.36)) };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/12 font-semibold text-primary ring-2 ring-base-100 ${className}`}
      style={style}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatars are arbitrary user URLs
        <img
          src={src}
          alt={user?.name ? `${user.name}'s profile picture` : "Profile picture"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <span aria-hidden="true">{initialsOf(user?.name, user?.email)}</span>
      )}
    </span>
  );
}
