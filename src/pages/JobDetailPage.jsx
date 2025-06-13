import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  ArrowLeft,
  DollarSign,
  Building,
  CheckCircle2,
  BookmarkPlus,
  Share2,
  Calendar,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { jobs } from "../components/job/JobList";

// Helper function to format salary
const formatSalary = (min, max, currency = "INR") => {
  if (!min || !max) return "Not specified";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [alreadyApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const job = jobs.find((j) => j.id === parseInt(id));

  const handleApplyClick = () => {
    // Check if user is logged in
    if (!currentUser) {
      // Redirect to login page with return URL
      navigate(`/login?returnTo=/jobs/${id}`);
      return;
    }

    // Check if user is a job seeker (not recruiter)
    if (currentUser.role === "recruiter") {
      alert(
        "Recruiters cannot apply for jobs. Please log in with a job seeker account.",
      );
      return;
    }

    setIsApplying(true);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError("");
    
    if (!file) {
      setResume(null);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      if (e.target) e.target.value = ""; // Clear the input
      setResume(null);
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      if (e.target) e.target.value = ""; // Clear the input
      setResume(null);
      return;
    }

    setResume(file);
    setUploadError("");
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setUploadError("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    setUploadError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically upload the file and submit the application
      // For now, we'll just simulate success
      console.log("Application submitted:", {
        jobId: job.id,
        userId: currentUser.id,
        resume: resume.name,
        coverLetter: coverLetter,
        submittedAt: new Date().toISOString()
      });

      setHasApplied(true);
      setIsSubmitting(false);
      setIsApplying(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      setUploadError("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          files: [file],
          value: ""
        }
      };
      handleResumeChange(syntheticEvent);
    }
  };

  const resetApplicationForm = () => {
    setIsApplying(false);
    setResume(null);
    setCoverLetter("");
    setUploadError("");
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-500"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Back Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Job Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {job.company.logo && (
                    <div className="flex-shrink-0 self-center sm:self-start">
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-3">
                      {job.company.name}
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.type}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span className="truncate">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Posted {formatDate(job.postedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line mb-6">
                  {job.description}
                </p>

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
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
              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  About the Company
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {job.company.logo && (
                    <div className="flex-shrink-0 self-center sm:self-start">
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {job.company.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center justify-center sm:justify-start">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company.industry}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
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

          {/* Application Sidebar - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-20">
              {alreadyApplied || hasApplied ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Application Submitted
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your application has been successfully submitted. Good luck!
                  </p>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate("/jobs")}
                  >
                    Browse More Jobs
                  </Button>
                </div>
              ) : isApplying ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Apply for this position
                    </h3>
                    <button
                      onClick={resetApplicationForm}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume *
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : uploadError
                            ? "border-red-300 bg-red-50"
                            : resume
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="resume-upload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeChange}
                        />
                        
                        {resume ? (
                          <div className="space-y-2">
                            <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                            <div className="text-sm font-medium text-green-700">
                              {resume.name}
                            </div>
                            <div className="text-xs text-green-600">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">Click to upload</span>
                              <span> or drag and drop</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              PDF, DOC, DOCX up to 5MB
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {uploadError && (
                        <div className="mt-2 flex items-center text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {uploadError}
                        </div>
                      )}
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell the employer why you're a great fit for this role..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting || !resume}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={resetApplicationForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Job Summary
                  </h3>
                  
                  {/* Job Details */}
                  <div className="space-y-4 mb-6">
                    {job.deadline && (
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Application Deadline
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(job.deadline)}
                          </p>
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
                        <IndianRupee className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Salary Range</p>
                          <p className="text-sm text-gray-600">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!currentUser ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-700 mb-3">
                          Please log in to apply for this job
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to={`/login?returnTo=/jobs/${id}`}
                          className="flex-1"
                        >
                          <Button variant="blue" fullWidth>
                            Login to Apply
                          </Button>
                        </Link>
                        <Link to="/register" className="flex-1">
                          <Button variant="outline" fullWidth>
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : currentUser.role === "recruiter" ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-700">
                        Recruiters cannot apply for jobs. Please log in with a job seeker account.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        fullWidth
                        onClick={handleApplyClick}
                      >
                        Apply Now
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          leftIcon={<BookmarkPlus className="h-4 w-4" />}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          leftIcon={<Share2 className="h-4 w-4" />}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;