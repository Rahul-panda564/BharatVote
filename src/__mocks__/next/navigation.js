/**
 * Mock for next/navigation used in Jest tests.
 * Provides mock implementations for useRouter, usePathname, and useSearchParams.
 */
const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
}));

const usePathname = jest.fn(() => '/');
const useSearchParams = jest.fn(() => new URLSearchParams());
const redirect = jest.fn();

module.exports = {
  useRouter,
  usePathname,
  useSearchParams,
  redirect,
};
