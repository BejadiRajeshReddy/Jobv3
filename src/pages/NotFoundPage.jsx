import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import {Button} from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might
          have been removed, renamed, or doesn't exist.
        </p>

        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;