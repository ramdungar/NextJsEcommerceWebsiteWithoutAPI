"use client";

import { useSyncExternalStore } from "react";

interface PersistCapable {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (callback: () => void) => () => void;
  };
}

/**
 * Zustand's `persist` middleware reads localStorage asynchronously after
 * mount, so the very first client render intentionally matches the server
 * (empty/default state) to avoid a hydration mismatch. Consumers that need
 * to know when the *real* persisted data has loaded (e.g. to avoid flashing
 * an "empty cart" message before localStorage is read) can use this hook,
 * which relies on `useSyncExternalStore` rather than an effect + setState.
 */
export function useHydratedStore<T extends PersistCapable>(store: T) {
  return useSyncExternalStore(
    (onStoreChange) => store.persist.onFinishHydration(onStoreChange),
    () => store.persist.hasHydrated(),
    () => false
  );
}
