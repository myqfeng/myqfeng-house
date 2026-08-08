/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  __openPagefindSearch?: (initialQuery?: string) => void;
}
