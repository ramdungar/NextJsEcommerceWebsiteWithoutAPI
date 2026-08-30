"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during the server render / initial hydration pass and
 * `true` once the component has mounted on the client. Implemented with
 * `useSyncExternalStore` (instead of `useState` + `useEffect`) so it never
 * triggers a cascading render from inside an effect.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
