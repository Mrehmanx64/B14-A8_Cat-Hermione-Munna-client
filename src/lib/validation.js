/** Shared form validation, mirrored by the Express API. */

import { todayString } from "./events";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function passwordIssues(password = "") {
  const issues = [];
  if (password.length < 6) issues.push("at least 6 characters");
  if (!/[A-Z]/.test(password)) issues.push("an uppercase letter");
  if (!/[a-z]/.test(password)) issues.push("a lowercase letter");
  return issues;
}

export function validatePassword(password) {
  const issues = passwordIssues(password);
  if (!issues.length) return null;
  return `Password must contain ${issues.join(", ").replace(/, ([^,]*)$/, " and $1")}.`;
}

export function validateUrl(value, { required = false, label = "URL" } = {}) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return required ? `${label} is required.` : null;
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol)) return `${label} must start with http or https.`;
    return null;
  } catch {
    return `${label} must be a valid link, e.g. https://images.example.com/photo.jpg`;
  }
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

export function validateRegister({ name, email, image, password, confirm }) {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";

  const imageError = validateUrl(image, { required: true, label: "Photo URL" });
  if (imageError) errors.image = imageError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  else if (confirm !== undefined && confirm !== password) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}

export function validateEvent(form) {
  const errors = {};
  // Compare calendar days ("YYYY-MM-DD" strings sort chronologically), so an
  // event happening today is accepted in every timezone.
  const today = todayString();

  if (!form.title.trim()) errors.title = "Title is required.";
  else if (form.title.trim().length < 5) errors.title = "Give the event a clearer title (5+ characters).";
  else if (form.title.trim().length > 120) errors.title = "Title must be 120 characters or fewer.";

  if (!form.description.trim()) errors.description = "Description is required.";
  else if (form.description.trim().length < 30) {
    errors.description = "Describe the event in at least 30 characters so volunteers know what to expect.";
  }

  if (!form.eventType) errors.eventType = "Choose an event type.";

  const imageError = validateUrl(form.thumbnail, { required: true, label: "Thumbnail URL" });
  if (imageError) errors.thumbnail = imageError;

  if (!form.location.trim()) errors.location = "Location is required.";
  else if (form.location.trim().length < 4) errors.location = "Add a more specific location.";

  if (!form.eventDate) {
    errors.eventDate = "Event date is required.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.eventDate)) {
    errors.eventDate = "Enter a valid date.";
  } else if (form.eventDate < today) {
    errors.eventDate = "Pick today or a later date.";
  }

  return errors;
}

export function validateProfile({ name, image }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.trim().length > 60) errors.name = "Name must be 60 characters or fewer.";

  const imageError = validateUrl(image, { required: true, label: "Photo URL" });
  if (imageError) errors.image = imageError;

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors ?? {}).length > 0;
