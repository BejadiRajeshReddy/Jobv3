import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Trophy,
  Target,
  Rocket,
  Building2,
  BarChart as ChartBar,
  Clock,
  Shield,
  Code,
  Stethoscope,
  PieChart as ChartPie,
  Pencil,
  Building,
  Truck,
  Wrench,
  Leaf,
  Gavel,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import companies from "../data/companies.json";
// import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { InfiniteSlider } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import JobList from "../components/job/JobList";

const HomePage = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const categories = [
    {
      icon: Code,
      name: "Technology",
      jobs: "Software, Data, IT",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Stethoscope,
      name: "Healthcare",
      jobs: "Medical, Nursing, Health",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: ChartPie,
      name: "Business",
      jobs: "Finance, Marketing, Sales",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Pencil,
      name: "Creative",
      jobs: "Design, Media, Arts",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Building,
      name: "Corporate",
      jobs: "Management, HR, Admin",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Truck,
      name: "Logistics",
      jobs: "Transport, Supply Chain",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Wrench,
      name: "Engineering",
      jobs: "Civil, Mechanical, Electrical",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: Leaf,
      name: "Environment",
      jobs: "Sustainability, Green Tech",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Gavel,
      name: "Legal",
      jobs: "Law, Paralegal, Compliance",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}

      <section className="min-h-screen flex items-start bg-blue-500  text-white py-18  px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-5xl md:text-7xl font-black sm:tracking-tight mb-4 py-10">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 mb-8">
              Connect with top companies hiring now. Thousands of jobs in tech,
              marketing, sales and more!
            </p>
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-2 flex">
              <div className="flex-grow">
                <div className="flex items-center h-full pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, skills or company"
                    className="appearance-none w-full pl-3 py-2 border-none focus:outline-none focus:ring-0 text-gray-900"
                  />
                </div>
              </div>
              <Link to="/jobs">
                <Button variant="blue">Search Jobs</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Find Jobs
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
      {/* Featured Jobs Section */}
      <section className="bg-white py-12 px-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="mt-3 text-xl text-gray-600">
              Handpicked opportunities from top companies
            </p>
          </div>
          <JobList limit={3} />
          <div className="mt-10 text-center">
            <Link to="/jobs" onClick={handleClick}>
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Job Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-10 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Job Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover opportunities across various industries
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 md:px-20">
            {categories.map((category, index) => (
              <Link
                key={index}
                // to="/jobs"
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-gray-600">{category.jobs}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* For Candidates Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-10 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                For Job Seekers
              </h2>
              <p className="text-xl text-gray-600">
                Stand out in the job market
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <Search className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
                <p className="text-gray-600">
                  Find relevant jobs with our intelligent search system
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <ChartBar className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
                <p className="text-gray-600">
                  Get real-time salary and industry trend data
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <Clock className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Easy Apply</h3>
                <p className="text-gray-600">
                  One-click applications with smart profiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* For Employers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-10 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                For Employers
              </h2>
              <p className="text-xl text-gray-600">
                Find your next star employee
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Growing Network</h3>
                <p className="text-gray-600">
                  Connect with motivated candidates actively seeking
                  opportunities
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow">
                <Building2 className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Company Showcase</h3>
                <p className="text-gray-600">
                  Build your employer brand with a custom profile
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow">
                <Trophy className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Dedicated Support
                </h3>
                <p className="text-gray-600">
                  Get personalized assistance for your hiring needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why us */}
      <section className="py-20  bg-white">
        <div className="container mx-auto px-10 sm:px-4 ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Us
              </h2>
              <p className="text-xl text-gray-600">
                Next-generation features for better job matching
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-xl  hover:shadow-lg transition-colors duration-300">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
                <p className="text-gray-600">
                  Smart algorithms that understand your requirements and match
                  you with the right opportunities
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl transition-colors hover:shadow-lg duration-300">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Verified Employers
                </h3>
                <p className="text-gray-600">
                  All companies are thoroughly verified to ensure safe and
                  legitimate job postings
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl  transition-colors hover:shadow-lg duration-300">
                <Rocket className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Quick Apply</h3>
                <p className="text-gray-600">
                  Apply to multiple jobs with a single click using your smart
                  profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Job Search?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream jobs
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button variant="blue" size="lg">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="danger" size="lg">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Client Logos Section */}
      {/* <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          loop: true,
          slidesToScroll: 1,
        }}
        className="bg-gray-900 w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-5 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/5">
              <img
                src={path}
                alt={name}
                className="h-6 sm:h-8 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel> */}

      <InfiniteSlider
        gap={112}
        duration={40}
        durationOnHover={60}
        className="bg-gray-900 w-full py-10"
      >
        {companies.map(({ name, id, path }) => (
          <div
            key={id}
            className="basis-1/3 lg:basis-1/5 flex justify-center items-center"
          >
            <img src={path} alt={name} className="h-6 sm:h-8 object-contain" />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
};

export default HomePage;
