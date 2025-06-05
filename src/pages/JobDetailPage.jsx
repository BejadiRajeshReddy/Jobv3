import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, IndianRupee, Clock, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: {
      name: "Facebook",
      logo: "/assets/facebook.svg",
      description: "Facebook is a social media and technology company that connects billions of people worldwide.",
      employees: "10,000+",
      industry: "Technology",
      website: "https://facebook.com",
    },
    location: "Hyderabad, India",
    salary: "₹250,000 - ₹300,000",
    type: "full-time",
    posted: "8 days ago",
    experience: "1-3 years",
    description: "We are looking for a skilled frontend developer to join our team. You will be responsible for building user interfaces using React. The ideal candidate should have strong experience with modern JavaScript frameworks and a passion for creating exceptional user experiences.",
    responsibilities: [
      "Develop and maintain responsive web applications using React",
      "Collaborate with designers to implement UI/UX designs",
      "Write clean, efficient, and reusable code",
      "Optimize applications for maximum performance",
      "Participate in code reviews and team discussions"
    ],
    requirements: [
      "1-3 years of experience in frontend development",
      "Strong proficiency in React, JavaScript, and TypeScript",
      "Experience with modern frontend tools and build systems",
      "Knowledge of responsive design and cross-browser compatibility",
      "Good understanding of web performance optimization"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health insurance",
      "Flexible working hours",
      "Remote work options",
      "Professional development budget"
    ],
    skills: ["React", "JavaScript", "CSS", "HTML", "tailwindcss"],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: {
      name: "Netflix",
      logo: "/assets/netflix.svg",
      description: "Netflix is the world's leading streaming entertainment service.",
      employees: "5,000+",
      industry: "Entertainment",
      website: "https://netflix.com",
    },
    location: "Bangalore, India",
    salary: "₹500,000 - ₹550,000",
    type: "full-time",
    posted: "3 days ago",
    experience: "3-5 years",
    description: "Looking for an experienced backend developer with strong Node.js skills. You'll be working on our core streaming infrastructure and helping scale our services to millions of users.",
    responsibilities: [
      "Design and implement scalable backend services",
      "Optimize database queries and performance",
      "Build and maintain RESTful APIs",
      "Work on real-time data processing systems",
      "Collaborate with cross-functional teams"
    ],
    requirements: [
      "3-5 years of backend development experience",
      "Strong knowledge of Node.js and Express",
      "Experience with MongoDB and SQL databases",
      "Understanding of microservices architecture",
      "Knowledge of AWS services"
    ],
    benefits: [
      "Industry-leading compensation",
      "Unlimited vacation policy",
      "Premium health coverage",
      "Annual learning budget",
      "Stock options"
    ],
    skills: ["Node.js", "Express", "MongoDB", "AWS", "SQL"],
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: {
      name: "Microsoft",
      logo: "/assets/microsoft.svg",
      description: "Microsoft is a leading global provider of software, cloud services, and technology solutions.",
      employees: "150,000+",
      industry: "Technology",
      website: "https://microsoft.com",
    },
    location: "Mumbai, India",
    salary: "₹800,000 - ₹900,000",
    type: "full-time",
    posted: "5 days ago",
    experience: "5+ years",
    description: "Join our team as a full stack developer working on exciting projects. We're looking for someone who can handle both frontend and backend development, with a focus on creating scalable enterprise applications.",
    responsibilities: [
      "Develop full-stack web applications",
      "Design and implement database schemas",
      "Create RESTful APIs and integrate third-party services",
      "Optimize application performance",
      "Mentor junior developers"
    ],
    requirements: [
      "5+ years of full-stack development experience",
      "Expert knowledge of React and Node.js",
      "Strong understanding of database design",
      "Experience with cloud platforms",
      "Knowledge of DevOps practices"
    ],
    benefits: [
      "Competitive salary package",
      "Comprehensive health benefits",
      "401(k) matching",
      "Flexible work arrangements",
      "Career development opportunities"
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Express", "Next.js"],
  },
];

const JobDetailPage = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === parseInt(id));

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-lg text-gray-600">{job.company.name}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.posted}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {job.experience}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="blue" className="w-full md:w-auto">
                Apply Now
              </Button>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {job.type}
              </span>
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About {job.company.name}
            </h3>
            <p className="text-gray-600 mb-4">{job.company.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Industry</span>
                <p className="font-medium text-gray-900">{job.company.industry}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Company Size</span>
                <p className="font-medium text-gray-900">
                  {job.company.employees}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Website</span>
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Description
            </h3>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Responsibilities
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-8 flex justify-center">
            <Button variant="blue" className="w-full md:w-auto">
              Apply for this position
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;