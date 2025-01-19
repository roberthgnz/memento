import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
} 

export function getRandomColor() {
  const colors = [
    '#fef3c7', // Yellow
    '#dbeafe', // Light Blue
    '#f5d0fe', // Light Purple
    '#fecaca', // Light Red
    '#d1fae5', // Light Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}