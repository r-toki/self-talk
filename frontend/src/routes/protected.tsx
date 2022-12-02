import { Home } from '@/pages/Home';
import { SelfTalksNew } from '@/pages/SelfTalksNew';

export const protectedRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/self_talks/new', element: <SelfTalksNew /> },
];
