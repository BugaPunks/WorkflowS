import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useParams: () => ({
    projectId: 'test-project',
  }),
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children);
});

// Mock NextAuth session
const mockUseSession = jest.fn(() => ({
  data: {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ESTUDIANTE',
    },
    expires: '2024-12-31T23:59:59.999Z',
  },
  status: 'authenticated',
}));

jest.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Export for use in tests
export { mockUseSession };