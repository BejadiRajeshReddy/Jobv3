import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  Briefcase as BriefcaseBusiness,
  Building2,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (role === "candidate" && !email) {
      setError("Email is required");
      return;
    }

    if (role === "recruiter" && (!orgName || !orgEmail)) {
      setError("Organization details are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u) => u.email === email)) {
        throw new Error("Email already exists");
      }

      if (role === "candidate" && users.some((u) => u.email === email)) {
        throw new Error("Email already exists");
      }
      if (
        role === "recruiter" &&
        users.some((u) => u.company?.email === orgEmail)
      ) {
        throw new Error("Organization email already exists");
      }

      const newUser = {
        id: Date.now().toString(),
        password,
        name,
        role,
        createdAt: new Date().toISOString(),
        ...(role === "recruiter"
          ? {
              company: {
                name: orgName,
                email: orgEmail,
                industry: "Technology",
                location: "Remote",
                logo: "https://images.pexels.com/photos/9042858/pexels-photo-9042858.jpeg?auto=compress&cs=tinysrgb&w=150",
              },
            }
          : {
              email,
              skills: [],
              experience: 0,
              education: [],
              applications: [],
            }),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      navigate(role === "candidate" ? "/jobs" : "/dashboard");
    } catch (err) {
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center   pb-10 px-8 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-8 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {/* Role Selection */}
          <div className="mb-4">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a:
            </label> */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all flex items-center justify-center ${
                  role === "candidate"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setRole("candidate")}
              >
                <UserIcon
                  className={`h-5 w-5 mr-2 ${
                    role === "candidate" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    role === "candidate"
                      ? "text-blue-700 font-medium"
                      : "text-gray-700"
                  }
                >
                  Job Seeker
                </span>
              </div>
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all flex items-center justify-center ${
                  role === "recruiter"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setRole("recruiter")}
              >
                <BriefcaseBusiness
                  className={`h-5 w-5 mr-2 ${
                    role === "recruiter" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    role === "recruiter"
                      ? "text-blue-700 font-medium"
                      : "text-gray-700"
                  }
                >
                  Recruiter
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full"
                />
              </div>
            </div>

            {/* Email */}
            {role === "candidate" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full"
                  />
                </div>
              </div>
            )}

            {/* Org Details for Recruiters */}
            {role === "recruiter" && (
              <>
                <div>
                  <label
                    htmlFor="orgName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organization Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="orgName"
                      name="orgName"
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="pl-10 block w-full"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="orgEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organization Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="orgEmail"
                      name="orgEmail"
                      type="email"
                      required
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="pl-10 block w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 block w-full"
                />
              </div>
            </div>

            <div>
              <Button
                variant="blue"
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create account
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
