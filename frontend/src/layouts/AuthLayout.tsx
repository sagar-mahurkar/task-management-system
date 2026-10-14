import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="container auth-page">
      <div className="row justify-content-center w-100 mx-auto">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <Outlet />
          <p className="text-center text-secondary small mt-4 mb-0">Task Manager · Make room for focused work</p>
        </div>
      </div>
    </main>
  );
}
