// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge and conditionally join classNames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns current timestamp in ISO format
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Simple error handler
 */
export function handleError(error: unknown) {
  console.error(error);
  return { error: (error as Error).message || "Unknown error" };
}

/**
 * Validate that all required fields exist
 */
export function validateRequiredFields<T extends object>(
  data: T,
  fields: (keyof T)[]
): string[] {
  return fields.filter((field) => !data[field]);
}

/**
 * Generate random tracking number
 */
export function generateTrackingNumber(length = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/**
 * Example: get user role
 */
export function getUserRole(user: { role?: string }) {
  return user.role || "guest";
}
