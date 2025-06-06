import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Clock, Briefcase, ArrowLeft, DollarSign, Building, CheckCircle2, BookmarkPlus, Share2, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { jobs } from "../components/job/JobList";

// Helper function to format salary
const formatSalary = (min, max, currency = "INR") => {
  if (!min || !max) return "Not specified";
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const job = jobs.find((j) => j.id === parseInt(id));

  const handleApplyClick = () => {
    setIsApplying(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasApplied(true);
    setIsSubmitting(false);
    setIsApplying(false);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
          <Link to="/jobs" className="mt-4 text-blue-600 hover:text-blue-500">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Job Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                {job.company.logo && (
                  <div className="flex-shrink-0">
                    <img 
                      src={job.company.logo} 
                      alt={job.company.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-gray-600">
                    {job.company.name}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {formatDate(job.postedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Company Info */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
              <div className="flex items-start gap-4">
                {job.company.logo && (
                  <div className="flex-shrink-0">
                    <img 
                      src={job.company.logo} 
                      alt={job.company.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.company.name}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    {job.company.industry}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  {job.company.website && (
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Application Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            {alreadyApplied || hasApplied ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted</h3>
                <p className="text-gray-600 mb-4">
                  Your application has been successfully submitted. Good luck!
                </p>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/jobs')}
                >
                  Browse More Jobs
                </Button>
              </div>
            ) : isApplying ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply for this position</h3>
                <form onSubmit={handleApplySubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                      placeholder="Tell the employer why you're a great fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      fullWidth
                      isLoading={isSubmitting}
                    >
                      Submit Application
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsApplying(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-4 mb-6">
                  {job.deadline && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Application Deadline</p>
                        <p className="text-sm text-gray-600">{formatDate(job.deadline)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Posted Date</p>
                      <p className="text-sm text-gray-600">{formatDate(job.postedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Job Type</p>
                      <p className="text-sm text-gray-600">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Salary Range</p>
                        <p className="text-sm text-gray-600">{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  fullWidth
                  onClick={handleApplyClick}
                  className="mb-3"
                >
                  Apply Now
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    leftIcon={<BookmarkPlus className="h-4 w-4" />}>
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    leftIcon={<Share2 className="h-4 w-4" />}>
                    Share
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;