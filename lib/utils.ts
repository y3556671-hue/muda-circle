import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isStudentEmail(email: string) {
  return normalizeEmail(email).endsWith("@student.unimelb.edu.au");
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function pickAvatarColor(seed: string) {
  const palette = ["#CC8800", "#2D6A4F", "#7C3AED", "#E76F51", "#3A86FF", "#F4A261"];
  const total = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
}

export function formatRelativePopularity(viewCount: number, likeCount: number, commentCount: number) {
  return viewCount * 3 + likeCount * 5 + commentCount * 4;
}
