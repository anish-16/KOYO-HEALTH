import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import path from 'node:path';
import os from 'node:os';

process.env.KOYO_DATA_DIR = path.join(os.tmpdir(), `koyo-tests-${process.pid}`);

// jsdom does not implement scroll APIs used by motion's measurement pass.
if (typeof window !== 'undefined') {
  window.scrollTo = () => undefined;
  window.matchMedia =
    window.matchMedia ??
    ((query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList);
}
process.env.SESSION_SECRET = 'test-session-secret-for-unit-tests';

afterEach(() => {
  vi.restoreAllMocks();
});
