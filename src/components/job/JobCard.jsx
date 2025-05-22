import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, IndianRupee, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-4 md:p-8 rounded-lg border hover:shadow-lg border-gray-200  transition-colors duration-300 hover:border-blue-400 cursor-pointer group">
      {/* Card Header */}
      <div className="flex flex-col space-y-4">
        {/* Position job type badge at top-right for all screen sizes */}
        <div className="flex items-start">
          {/* Company Logo and Main Info */}
          <div className="flex gap-3 flex-1">
            <div className="flex-shrink-0">
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-12 h-12 object-contain rounded-md group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600">
                {job.title}
              </h3>
              <p className="text-gray-600 truncate group-hover:text-red-600 group-hover:font-medium">
                {job.company.name}
              </p>
            </div>
          </div>

          {/* Job Type Badge - Now always visible and in top-right */}
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap self-start">
            {job.type}
          </span>
        </div>

        {/* Job Location, Salary, and Posted Date */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center mr-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center mr-2">
            <IndianRupee className="w-4 h-4 mr-1 " />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className="truncate">{job.posted}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            {job.experience}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <p className="mt-3 text-gray-600 text-sm line-clamp-2">
        {job.description}
      </p>

      {/* Skills and Action Button */}
      <div className="mt-4 space-y-4">
        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-end ">
          <Link to={`/jobs/${job.id}`} className="block w-full sm:w-auto">
            <Button variant="blue" className="w-full group-hover:scale-105 transition-transform duration-300">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
