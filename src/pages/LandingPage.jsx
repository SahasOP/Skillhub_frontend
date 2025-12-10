import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Code,
  UserCircle,
  ArrowRight,
  Check,
  BarChart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "@/ui/button";
import blueclglogo from "../assets/logoL.png";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Assuming you have this in your Redux store

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Check visibility of sections
      const sections = ["features", "tracking", "cta"];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          setIsVisible((prev) => ({
            ...prev,
            [section]: rect.top < window.innerHeight * 0.75,
          }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Animated progress stats
  const progressStats = [
    { label: "Completion Rate", value: 85, color: "bg-blue-500" },
    { label: "Student Satisfaction", value: 92, color: "bg-green-500" },
    { label: "Practice Problems", value: 78, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* College Header */}
      <header
        className="flex items-center justify-between px-4"
        style={{
          background: "linear-gradient(270deg, #002f6c, #0d47a1)", // bg-gradient-to-r from-gray-800 to-gray-950  Reversed gradient with a blue touch
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Mahavir Education Trust's
          </h1>
          <h2 className="text-3xl font-bold text-blue-100">
            Shah And Anchor Kutchhi Engineering College
          </h2>
        </div>
        <img
          src={blueclglogo || "/placeholder.svg"}
          alt="College Logo"
          className="my-4 h-24 w-24"
        />
      </header>
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">SkillHub</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-8">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("tracking")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Progress Tracking
                </button>
                <button
                  onClick={() => scrollToSection("cta")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Get Started
                </button>
                <Link to="/signup" className="inline-flex items-center">
                  <Button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login" className="inline-flex items-center">
                  <Button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("tracking")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Progress Tracking
                </button>
                <button
                  onClick={() => scrollToSection("cta")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Get Started
                </button>
                {/* {isLoggedIn ? (
                  <UserMenu />
                ) : ( */}
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Sign In
                </Button>
                {/* )} */}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Abstract Graphics */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-16">
        <div className="container mx-auto px-6 py-20 relative">
          {/* Abstract Background SVG */}
          <svg
            className="absolute top-0 right-0 opacity-10"
            width="400"
            height="400"
            viewBox="0 0 400 400"
          >
            <circle cx="200" cy="200" r="150" fill="white" />
            <path
              d="M 100 100 Q 200 50 300 100 T 500 100"
              stroke="white"
              fill="none"
              strokeWidth="20"
            />
            <rect
              x="50"
              y="150"
              width="100"
              height="100"
              fill="white"
              transform="rotate(45 100 200)"
            />
          </svg>

          <div className="max-w-3xl relative z-10">
            <h1 className="text-5xl font-bold mb-6">
              Master Your Technical Skills with SkillHub
            </h1>
            <p className="text-xl mb-8">
              Your complete learning companion for aptitude tests, DSA practice,
              and professional growth.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid with Decorative Elements */}
      <div id="features" className="container mx-auto px-6 py-20 relative">
        {/* Decorative Background Elements */}
        <svg
          className="absolute left-0 top-0 opacity-5"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <h2 className="text-3xl font-bold text-center mb-16">
          Why Choose SkillHub?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="90" cy="10" r="40" fill="currentColor" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">
                Aptitude Test Preparation
              </h3>
              <p className="text-gray-600">
                Comprehensive practice materials covering quantitative, logical,
                and verbal reasoning with detailed solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <rect
                  x="50"
                  y="10"
                  width="40"
                  height="40"
                  transform="rotate(45 70 30)"
                  fill="currentColor"
                />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold">DSA Roadmap</h3>
              <p className="text-gray-600">
                Structured learning path for Data Structures and Algorithms with
                topic-wise practice problems and solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <path
                  d="M10 90 Q 50 10 90 90"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="20"
                />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Profile Building</h3>
              <p className="text-gray-600">
                Create and maintain your professional profile, showcase your
                skills, and track your learning progress.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Tracking Section with Enhanced Animations */}
      <div
        id="tracking"
        className={`bg-gray-100 py-20 relative transition-all duration-1000 ${isVisible.tracking
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl font-bold mb-6">Track Your Progress</h2>

              {/* Animated Progress Bars */}
              <div className="space-y-6">
                {progressStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{stat.label}</span>
                      <span className="font-medium">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} transition-all duration-1000`}
                        style={{
                          width: isVisible.tracking ? `${stat.value}%` : "0%",
                          transitionDelay: `${index * 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Animated Feature List */}
              <div className="space-y-4">
                {[
                  "Real-time performance analytics",
                  "Personalized learning recommendations",
                  "Progress tracking across all topics",
                  "Regular evaluation reports",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 transition-all duration-500"
                    style={{
                      transform: isVisible.tracking
                        ? "translateX(0)"
                        : "translateX(-20px)",
                      opacity: isVisible.tracking ? 1 : 0,
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <Check className="text-green-600 h-5 w-5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Chart Section */}
            <div className="lg:w-1/2">
              <div
                className={`bg-white p-6 rounded-lg shadow-lg relative transition-all duration-1000 ${isVisible.tracking
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                  }`}
              >
                <div className="flex items-center justify-center h-64">
                  <div className="relative">
                    <BarChart
                      className={`h-32 w-32 text-blue-600 transition-all duration-1000 ${isVisible.tracking
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-90"
                        }`}
                    />
                    {/* Animated Circles */}
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"
                        style={{
                          animationDelay: `${i * 0.5}s`,
                          opacity: 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" className="mx-auto px-6 py-20 text-center relative">
        {/* Decorative Background */}
        <svg
          className="absolute left-0 top-0 opacity-5"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 C 50 100 80 100 100 0 L 100 100 L 0 100"
            fill="currentColor"
          />
        </svg>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners who have accelerated their career growth
            with SkillHub
          </p>
          <Link to="/signup" className="block px-4 py-2 text-white">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-lg">
              Sign Up Now
              <ArrowRight className="ml-2 inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Testimonials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2025 SkillHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
