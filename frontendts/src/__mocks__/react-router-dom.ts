import React from 'react';

export const useNavigate = () => jest.fn();
export const useParams = () => ({ 
  id: 'test-offer-001' 
});
export const useLocation = () => ({ 
  pathname: '/drives/test-offer-001',
  search: '?filter=angebote',
  state: null
});
export const useSearchParams = () => [
  new URLSearchParams('filter=angebote&location=Berlin'),
  jest.fn()
];

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => 
  React.createElement('div', { 'data-testid': 'browser-router' }, children);

export const Routes = ({ children }: { children: React.ReactNode }) => 
  React.createElement('div', { 'data-testid': 'routes' }, children);

export const Route = ({ children }: { children: React.ReactNode }) => 
  React.createElement('div', { 'data-testid': 'route' }, children);

export const Navigate = (props: any) => 
  React.createElement('div', { 'data-testid': 'navigate', ...props });

export const Link = ({ children, to, ...props }: any) => 
  React.createElement('a', { href: to, 'data-testid': 'link', ...props }, children);