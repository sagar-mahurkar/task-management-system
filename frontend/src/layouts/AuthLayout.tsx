import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return <main className="container py-5"><div className="row justify-content-center"><div className="col-12 col-sm-10 col-md-7 col-lg-5"><Outlet /></div></div></main>;
}
