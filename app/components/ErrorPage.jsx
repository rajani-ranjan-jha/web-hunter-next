import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-900 p-4">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="mb-4">{error.statusText || error.message || 'Unknown error'}</p>
      <Link to="/" className="text-blue-600 underline">Go back to Home</Link>
    </div>
  );
};

export default ErrorPage;
