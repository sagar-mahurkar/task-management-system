import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

export function NotFoundPage() {
  return <section className="py-5 text-center"><h1 className="display-6">Page not found</h1><Link to={ROUTES.HOME}>Return home</Link></section>;
}
