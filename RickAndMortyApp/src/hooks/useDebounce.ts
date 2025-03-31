import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 *
 * This hook takes a value and a delay, and returns a new value
 * that only updates after the specified delay has passed without
 * the original value changing. This is useful for delaying expensive
 * operations like API calls based on user input (e.g., typing in a search box).
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
