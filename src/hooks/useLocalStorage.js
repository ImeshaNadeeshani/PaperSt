import { useState, useEffect } from "react";
export default function useLocalStorage(
  key,
  initial,
  migrate = (value) => value,
) {
  const [value, setValue] = useState(() => {
    try {
      return migrate(JSON.parse(localStorage.getItem(key)) ?? initial);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new CustomEvent("paperist-storage-error"));
    }
  }, [key, value]);
  return [value, setValue];
}
