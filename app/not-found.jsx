export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 text-center px-6">
      <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
      >
        Go Back Home
      </a>
    </div>
  );
}
