import "./styles-not-found.css";

/**
 * NotFound component
 * @returns {JSX.Element} NotFound component
 */
export default function NotFound () {
  return (
    <div className="container-not-found">
      <h1 className="error-404">Error 404</h1>
      <h2 className="message-not-found">Página no encontrada</h2>
    </div>
  );
}