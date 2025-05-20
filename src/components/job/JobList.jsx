import React from "react";
import JobCard from "./JobCard";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: {
      name: "Facebook",
      logo: "/assets/facebook.svg",
    },
    location: "Hyderabad, India",
    salary: "₹250,000 - ₹300,000",
    type: "full-time",
    posted: "8 days ago",
    experience: "1-3 years",
    description:
      "We are looking for a skilled frontend developer to join our team. You will be responsible for building user interfaces using React.",
    skills: ["React", "JavaScript", "CSS", "HTML"],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: {
      name: "Netflix",
      logo: "/assets/netflix.svg",
    },
    location: "Bangalore, India",
    salary: "₹500,000 - ₹550,000",
    type: "full-time",
    posted: "3 days ago",
    experience: "3-5 years",
    description:
      "Looking for an experienced backend developer with strong Node.js skills.",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: {
      name: "Microsoft",
      logo: "/assets/microsoft.svg",
    },
    location: "Mumbai, India",
    salary: "₹800,000 - ₹900,000",
    type: "full-time",
    posted: "5 days ago",
    experience: "5+ years",
    description:
      "Join our team as a full stack developer working on exciting projects.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: {
      name: "Google",
      logo: "/assets/google.svg",
    },
    location: "Bangalore, India",
    salary: "₹400,000 - ₹450,000",
    type: "part-time",
    posted: "2 days ago",
    experience: "0-1 years",
    description:
      "Create beautiful and intuitive user interfaces for our products.",
    skills: ["Figma", "Adobe XD", "UI Design", "UX Research"],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: {
      name: "Amazon",
      logo: "/assets/aws.svg",
    },
    location: "Hyderabad, India",
    salary: "₹700,000 - ₹800,000",
    type: "contract",
    posted: "1 week ago",
    experience: "3-5 years",
    description:
      "Looking for a DevOps engineer to help us scale our infrastructure.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
];

const JobList = ({ searchQuery, filters, limit }) => {
  const getSalaryRange = (salaryString) => {
    const cleanString = salaryString.replace(/[₹,]/g, "");
    const numbers = cleanString.match(/\d+/g).map(Number);
    return {
      min: numbers[0],
      max: numbers[1] || numbers[0],
    };
  };

  const getExperienceYears = (experienceString) => {
    const numbers = experienceString.match(/\d+/g).map(Number);
    return {
      min: numbers[0],
      max: numbers[1] || numbers[0],
    };
  };

  const isInSalaryRange = (jobSalary, filterRange) => {
    if (filterRange === "all") return true;

    const { min: jobMin } = getSalaryRange(jobSalary);

    switch (filterRange) {
      case "0-300000":
        return jobMin <= 300000;
      case "300000-600000":
        return jobMin > 300000 && jobMin <= 600000;
      case "600000+":
        return jobMin > 600000;
      default:
        return true;
    }
  };

  const isInExperienceRange = (jobExperience, filterRange) => {
    if (filterRange === "all") return true;

    const { min: jobMin } = getExperienceYears(jobExperience);

    switch (filterRange) {
      case "0-1":
        return jobMin <= 1;
      case "1-3":
        return jobMin >= 1 && jobMin <= 3;
      case "3-5":
        return jobMin >= 3 && jobMin <= 5;
      case "5+":
        return jobMin >= 5;
      default:
        return true;
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Search query filter
    const searchLower = searchQuery?.toLowerCase() || "";
    const matchesSearch =
      job.title.toLowerCase().includes(searchLower) ||
      job.company.name.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchLower));

    // Type filter
    const matchesType =
      !filters?.type || filters.type === "all" || job.type === filters.type;

    // Location filter
    const matchesLocation =
      !filters?.location ||
      filters.location === "all" ||
      job.location.includes(filters.location);

    // Salary filter
    const matchesSalary =
      !filters?.salary || isInSalaryRange(job.salary, filters.salary);

    // Experience filter
    const matchesExperience =
      !filters?.experience ||
      isInExperienceRange(job.experience, filters.experience);

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesSalary &&
      matchesExperience
    );
  });

  const displayJobs = limit ? filteredJobs.slice(0, limit) : filteredJobs;

  return (
    <div className="space-y-6">
      {displayJobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            No jobs found matching your criteria
          </p>
        </div>
      ) : (
        displayJobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
};

export default JobList;
