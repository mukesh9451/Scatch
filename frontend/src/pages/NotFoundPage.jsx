import { Header } from '../components/Header';
import './NotFoundPage.css';

export function NotFoundPage({cart}) {
  return (
    <>
      <title>404 Page Not Found</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

      <Header cart={cart} />

      <div className="not-found-message">
        <h2>Page not found</h2>
      </div>
    </>
  );
}