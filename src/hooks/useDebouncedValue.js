import { useEffect, useState } from "react";

/**
 * Delays a fast-changing value (like a search box) so we hit the API once the
 * user pauses, not on every keystroke.
 */
export function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
