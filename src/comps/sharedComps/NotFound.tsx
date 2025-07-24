import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white px-4">
      <div className="flex items-center space-x-4 mb-6">
        <AlertTriangle className="w-12 h-12 text-yellow-400 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold">404 - Not Found</h1>
      </div>
      <p className="text-lg md:text-xl text-center max-w-md mb-8 text-gray-100">
        Oops! The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
