import React from "react";
import { Link } from "react-router-dom";
import { Home, ShieldOff } from "lucide-react";
import { Button } from "../components/ui/Button";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 rounded-full p-4">
            <ShieldOff className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. Please check your
          credentials or contact the administrator.
        </p>

        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button LeftIcon={<Home className="h-5 w-5" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;