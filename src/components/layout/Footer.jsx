import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase as BriefcaseBusiness,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white md:pt-15">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:pl-25">
          <div className="text-center md:text-left md:pr-10 p-10 md:p-0">
            <Link
              to="/"
              className="inline-flex items-center justify-center md:justify-start"
            >
              <BriefcaseBusiness className="h-10 w-10 text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-white">JobHub</span>
            </Link>
            <p className="mt-8 text-gray-400 text-lg md:text-base">
              Connecting top talent with great companies.
            </p>
            <p className="mt-8 ml-2 text-gray-400 text-lg md:text-base md:font-medium">
              Contact with us
            </p>
            <div className="flex justify-center md:justify-start space-x-6 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400">
              For Job Seekers
            </h3>
            <ul className="mt-6 space-y-4 text-lg md:text-sm">
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-white">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Job Alerts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Career Advice
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400">
              For Employers
            </h3>
            <ul className="mt-6 space-y-4 text-lg md:text-sm">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Browse Candidates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Recruitment Tools
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-6 space-y-4 text-lg md:text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white ">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-4">
          <p className="text-gray-400 text-base text-center">
            &copy; {new Date().getFullYear()} JobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
