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
    const file = e.target.files[0];
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
      e.target.value = ""; // Clear the input
      setResume(null);
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      e.target.value = ""; // Clear the input
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  if (!job) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        data-oid="992:qx."
      >
        <div className="text-center" data-oid="lf9_xtp">
          <h2 className="text-2xl font-bold text-gray-900" data-oid="_o5fnta">
            Job not found
          </h2>
          <Link
            to="/jobs"
            className="mt-4 text-blue-600 hover:text-blue-500"
            data-oid="s6j:38-"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      data-oid="ypnqzi1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="gw3ckw5">
        <div className="lg:col-span-2" data-oid="_q2vw0_">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            data-oid="1i4wv4."
          >
            {/* Job Header */}
            <div className="p-6 border-b border-gray-200" data-oid="blgvsk3">
              <div className="flex items-start gap-4" data-oid="_fz8wjd">
                {job.company.logo && (
                  <div className="flex-shrink-0" data-oid="hrgg-k0">
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-16 h-16 object-cover rounded-md"
                      data-oid="lhb1cbn"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0" data-oid="ixw1apw">
                  <h1
                    className="text-2xl font-bold text-gray-900"
                    data-oid="3nu8g4p"
                  >
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-gray-600" data-oid="wmc.6ab">
                    {job.company.name}
                  </p>

                  <div
                    className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500"
                    data-oid="0vma353"
                  >
                    <div className="flex items-center" data-oid="andil3k">
                      <MapPin className="h-4 w-4 mr-1" data-oid="8.bbs01" />
                      {job.location}
                    </div>
                    <div className="flex items-center" data-oid="1a0fr4j">
                      <Briefcase className="h-4 w-4 mr-1" data-oid="95xnn5t" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center" data-oid="2pnvhcx">
                        {/* <IndianRupee className="h-4 w-4 mr-1" /> */}
                        {formatSalary(
                          job.salary.min,
                          job.salary.max,
                          job.salary.currency,
                        )}
                      </div>
                    )}
                    <div className="flex items-center" data-oid="ap:gy8:">
                      <Clock className="h-4 w-4 mr-1" data-oid="r8r3l0g" />
                      Posted {formatDate(job.postedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="p-6" data-oid="_0c67b4">
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                data-oid="ycs9dog"
              >
                Job Description
              </h2>
              <p
                className="text-gray-700 whitespace-pre-line"
                data-oid="_g5yvn9"
              >
                {job.description}
              </p>

              <h2
                className="text-xl font-semibold text-gray-900 mt-8 mb-4"
                data-oid="fyrdjoo"
              >
                Requirements
              </h2>
              <ul
                className="list-disc pl-5 space-y-2 text-gray-700"
                data-oid="e-p_3c2"
              >
                {job.requirements.map((req, index) => (
                  <li key={index} data-oid="unjfji2">
                    {req}
                  </li>
                ))}
              </ul>

              <h2
                className="text-xl font-semibold text-gray-900 mt-8 mb-4"
                data-oid="bh16yap"
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2" data-oid="ms77gnn">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    data-oid="a--20ra"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div
              className="p-6 border-t border-gray-200 bg-gray-50"
              data-oid="6bhersk"
            >
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                data-oid="oi-:8nw"
              >
                About the Company
              </h2>
              <div className="flex items-start gap-4" data-oid="gpl1diw">
                {job.company.logo && (
                  <div className="flex-shrink-0" data-oid="ua3d8jp">
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-16 h-16 object-cover rounded-md"
                      data-oid="8rghfaf"
                    />
                  </div>
                )}
                <div data-oid="fh9s76h">
                  <h3
                    className="text-lg font-medium text-gray-900"
                    data-oid="z_rfmuj"
                  >
                    {job.company.name}
                  </h3>
                  <div
                    className="mt-2 flex items-center text-sm text-gray-500"
                    data-oid="a-gqab7"
                  >
                    <Building className="h-4 w-4 mr-1" data-oid="swfjjao" />
                    {job.company.industry}
                  </div>
                  <div
                    className="mt-1 flex items-center text-sm text-gray-500"
                    data-oid="k10roa_"
                  >
                    <MapPin className="h-4 w-4 mr-1" data-oid="yj6zer9" />
                    {job.location}
                  </div>
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      data-oid="n35mdze"
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
        <div className="lg:col-span-1" data-oid="6u5cbn_">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20"
            data-oid="et87m85"
          >
            {alreadyApplied || hasApplied ? (
              <div className="text-center py-4" data-oid="all988s">
                <div
                  className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4"
                  data-oid="yb_asid"
                >
                  <CheckCircle2 className="h-8 w-8" data-oid="tvt4m.g" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  data-oid="2kh6dh3"
                >
                  Application Submitted
                </h3>
                <p className="text-gray-600 mb-4" data-oid="-gsatdr">
                  Your application has been successfully submitted. Good luck!
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate("/jobs")}
                  data-oid="u.l1z97"
                >
                  Browse More Jobs
                </Button>
              </div>
            ) : isApplying ? (
              <div data-oid="5bxxvpq">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-4"
                  data-oid="kn2doyf"
                >
                  Apply for this position
                </h3>
                <form onSubmit={handleApplySubmit} data-oid="qg5op9r">
                  <div className="mb-4" data-oid="3:r4zc1">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      data-oid="zgsje4w"
                    >
                      Resume *
                    </label>
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      data-oid="x0er4fx"
                    >
                      <div className="space-y-1 text-center" data-oid="1eymf76">
                        <Upload
                          className="mx-auto h-12 w-12 text-gray-400"
                          data-oid="8nvrubz"
                        />
                        <div
                          className="flex text-sm text-gray-600"
                          data-oid="dw60_9e"
                        >
                          <label
                            htmlFor="resume-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            data-oid="zd8vjyb"
                          >
                            <span data-oid="8d.lobd">Upload your resume</span>
                            <input
                              id="resume-upload"
                              name="resume-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeChange}
                              data-oid="em_dsdr"
                            />
                          </label>
                          <p className="pl-1" data-oid="81_7i5g">
                            or drag and drop
                          </p>
                        </div>
                        <p className="text-xs text-gray-500" data-oid="mj2yds1">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {uploadError && (
                      <div className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {uploadError}
                      </div>
                    )}
                    
                    {/* Success Message */}
                    {resume && !uploadError && (
                      <div
                        className="mt-2 text-sm text-green-600 flex items-center"
                        data-oid="9zs-n.o"
                      >
                        <CheckCircle2
                          className="h-4 w-4 mr-1"
                          data-oid="q823l9r"
                        />
                        {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </div>
                    )}
                  </div>

                  <div className="mb-4" data-oid="36l3jfh">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-oid="mhonxdh"
                    >
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                      placeholder="Tell the employer why you're a great fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      data-oid="ja_s6_d"
                    />
                  </div>
                  <div className="flex space-x-2" data-oid="u:4fu-y">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting || !resume}
                      data-oid="vvz.eqk"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsApplying(false);
                        setResume(null);
                        setCoverLetter("");
                        setUploadError("");
                      }}
                      data-oid="j1-j4z."
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h3
                  className="text-xl font-semibold text-gray-900 mb-4"
                  data-oid=".eg75wz"
                >
                  Job Summary
                </h3>
                <div className="space-y-4 mb-6" data-oid="6ecd7:c">
                  {job.deadline && (
                    <div className="flex items-start" data-oid="kprvye:">
                      <Calendar
                        className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                        data-oid="h5cf-6o"
                      />
                      <div data-oid="yhselgt">
                        <p
                          className="text-sm font-medium text-gray-700"
                          data-oid="gyhdese"
                        >
                          Application Deadline
                        </p>
                        <p className="text-sm text-gray-600" data-oid="sz.xz7p">
                          {formatDate(job.deadline)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start" data-oid="5_7l8jh">
                    <Clock
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="m:kt01j"
                    />
                    <div data-oid="ato4_2u">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="999rg79"
                      >
                        Posted Date
                      </p>
                      <p className="text-sm text-gray-600" data-oid="hy-pwys">
                        {formatDate(job.postedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start" data-oid="0a:2zk7">
                    <Briefcase
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="aorxo:e"
                    />
                    <div data-oid="f:3k5ja">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="bgy7fjf"
                      >
                        Job Type
                      </p>
                      <p className="text-sm text-gray-600" data-oid="fe:pp3m">
                        {job.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start" data-oid="3ej2ui:">
                    <MapPin
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="u9wtjoe"
                    />
                    <div data-oid="t2ap.wq">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="pkh8p:a"
                      >
                        Location
                      </p>
                      <p className="text-sm text-gray-600" data-oid=".w4n:_j">
                        {job.location}
                      </p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-start" data-oid="zls7pjc">
                      <IndianRupee
                        className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                        data-oid="si5-4z-"
                      />
                      <div data-oid="qi63cuo">
                        <p
                          className="text-sm font-medium text-gray-700"
                          data-oid="76w.4-5"
                        >
                          Salary Range
                        </p>
                        <p className="text-sm text-gray-600" data-oid="hv1sqiz">
                          {formatSalary(
                            job.salary.min,
                            job.salary.max,
                            job.salary.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Login prompt for non-logged in users */}
                {!currentUser ? (
                  <div
                    className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
                    data-oid="cifg5rw"
                  >
                    <p
                      className="text-sm text-blue-700 mb-3"
                      data-oid="8-pup1k"
                    >
                      Please log in to apply for this job
                    </p>
                    <div className="flex space-x-2" data-oid="pn5p41.">
                      <Link
                        to={`/login?returnTo=/jobs/${id}`}
                        className="flex-1"
                        data-oid="exff.xk"
                      >
                        <Button variant="blue" fullWidth data-oid="cvrka1h">
                          Login to Apply
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        className="flex-1"
                        data-oid="71xso:q"
                      >
                        <Button variant="outline" fullWidth data-oid="sztphw9">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : currentUser.role === "recruiter" ? (
                  <div
                    className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
                    data-oid="v5-:k1f"
                  >
                    <p className="text-sm text-yellow-700" data-oid="ix35ftu">
                      Recruiters cannot apply for jobs. Please log in with a job
                      seeker account.
                    </p>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    onClick={handleApplyClick}
                    className="mb-3"
                    data-oid="3ri0bgw"
                  >
                    Apply Now
                  </Button>
                )}

                <div className="flex space-x-2" data-oid="0aotufp">
                  <Button
                    variant="outline"
                    className="flex-1"
                    leftIcon={
                      <BookmarkPlus className="h-4 w-4" data-oid="7ne90um" />
                    }
                    data-oid="2iv8i33"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    leftIcon={<Share2 className="h-4 w-4" data-oid="m.vmo28" />}
                    data-oid="qhd1aey"
                  >
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