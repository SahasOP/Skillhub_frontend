import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles.css";
import Header from "../custom/Header";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import {
  Settings,
  Camera,
  BarChart,
  User2,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Sector,
  Cell,
} from "recharts";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

  const progressData = [
    { name: "Week 1", progress: 20 },
    { name: "Week 2", progress: 35 },
    { name: "Week 3", progress: 45 },
    { name: "Week 4", progress: 60 },
    { name: "Week 5", progress: 75 },
    { name: "Week 6", progress: 85 },
  ];

  const aptitudeData = [
    { name: "Verbal", value: 30, color: COLORS[0] },
    { name: "Quantitative", value: 25, color: COLORS[1] },
    { name: "Logical", value: 20, color: COLORS[2] },
    { name: "Technical", value: 15, color: COLORS[3] },
    { name: "Abstract", value: 10, color: COLORS[4] },
  ];

 

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">
            Score: <span className="font-medium">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const EnhancedPieChart = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handlePieEnter = (_, index) => {
      if (selectedIndex === null) {
        setActiveIndex(index);
      }
    };

    const handlePieLeave = () => {
      if (selectedIndex === null) {
        setActiveIndex(null);
      }
    };

    const handlePieClick = (_, index) => {
      setSelectedIndex(selectedIndex === index ? null : index);
      setActiveIndex(selectedIndex === index ? null : index);
    };

    const handleBadgeClick = (index) => {
      setSelectedIndex(selectedIndex === index ? null : index);
      setActiveIndex(selectedIndex === index ? null : index);
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Aptitude Tests Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aptitudeData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                  onMouseEnter={handlePieEnter}
                  onMouseLeave={handlePieLeave}
                  onClick={handlePieClick}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  animationBegin={0}
                  animationDuration={1200}
                  cursor="pointer"
                >
                  {aptitudeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        selectedIndex !== null && selectedIndex !== index
                          ? 0.5
                          : 1
                      }
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {aptitudeData.map((entry, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer
                  ${selectedIndex === index ? "bg-gray-200" : "bg-gray-50"}`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity:
                    selectedIndex !== null && selectedIndex !== index ? 0.5 : 1,
                  y: 0,
                }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBadgeClick(index)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
                <span className="text-sm text-gray-500">({entry.value}%)</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId) => {
    const navbarHeight = 80; // Height of your navbar in pixels
    const element = document.getElementById(sectionId);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="flex">
      <div className="flex h-screen fixed">
        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header Section */}
        <Header />
        <header className="fixed top-0 right-0 left-64 bg-white shadow-sm z-50">
          {" "}
          {/* Adjusted left offset */}
          <div className="flex items-center justify-between px-6 h-20">
            {" "}
            {/* Fixed height */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SkillHub</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              {["dashboard", "progress", "contact"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`px-3 py-2 text-sm font-medium ${
                      activeSection === section
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              )}
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/userprofile">
                <Button className="shadow-none bg-white">
                  <User2 size={24} className="text-gray-600" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        {/* Header Navbar */}

        {/* Main Content */}
        <div
        // className={`transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"} `}
        >
          {/* Hero Section */}
          <section
            id="dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8"
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Your Learning Journey
              </h1>
              <p className="text-xl opacity-90">
                Master DSA, Ace Interviews, Top the Rankings
              </p>
              <div className="mt-8 flex space-x-4">
                <Link to="/learningpath">
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90">
                    Start Learning
                  </button>
                </Link>
                <Link to="/testdashboard">
                  <button className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10">
                    Take a Test
                  </button>
                </Link>
              </div>
            </div>
          </section>

          <main className="p-8">
            {/* Quick Action Cards */}
            <section
              id="practice"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Practice DSA</h3>
                    <Camera className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Access 500+ curated DSA problems with solutions
                  </p>
                  <Link to="/learningpath">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start Practice
                    </button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Attempt Test</h3>
                    <BarChart className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Take a mock test to assess your preparation
                  </p>
                  <Link to="/testdashboard">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Start Test
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </section>

            <section id="progress">
              {/* Learning Tracks Grid */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {learningTracks.map((track, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {track.icon}
                        <h3 className="ml-2 font-semibold">{track.name}</h3>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${track.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            Progress
                          </span>
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {track.progress}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div> */}

              {/* Featured Content */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
              {/* Upcoming Competitions */}
              {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-yellow-500" />
                      Upcoming Competitions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Code Sprint Challenge",
                          date: "Tomorrow",
                          prize: "1st Prize: ₹5000",
                        },
                        {
                          title: "Algorithmic Battle",
                          date: "This Weekend",
                          prize: "Certificate & Swag",
                        },
                      ].map((competition, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                {competition.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {competition.date}
                              </p>
                              <p className="text-sm text-yellow-600">
                                {competition.prize}
                              </p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm">
                              Register
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}

              {/* Your Achievements */}
              {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-purple-500" />
                      Your Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Problem Solving Expert",
                          desc: "Solved 100+ DSA problems",
                          icon: "🏆",
                        },
                        {
                          title: "Quick Thinker",
                          desc: "Top 5% in Aptitude Test",
                          icon: "🎯",
                        },
                        {
                          title: "Interview Ready",
                          desc: "Completed 5 mock interviews",
                          icon: "🌟",
                        },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl mr-4">
                            {achievement.icon}
                          </span>
                          <div>
                            <h3 className="font-semibold">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {achievement.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}
              {/* </div> */}
            </section>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Progress Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold">
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="progress"
                          stroke="#4F46E5"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Aptitude Tests Pie Chart */}
              <EnhancedPieChart />
            </div>
            {/* Testimonials Section */}
            {/* <section id="testimonials" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-700">{testimonial.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section> */}

            {/* Blog Section */}
            {/* <section id="blogs" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Latest from Our Blog</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{blog.date}</span>
                        <span className="mx-2">•</span>
                        <span>{blog.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section> */}

            {/* Contact Section */}
            <section id="contact" className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Contact Information
                      </h3>
                      <p className="text-gray-600">
                        Email: support@skillhub.com
                      </p>
                      <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
                      <p className="text-gray-600">
                        Address: 123 Learning Street, Education City
                      </p>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full p-2 border rounded-lg"
                      />
                      <textarea
                        placeholder="Your Message"
                        className="w-full p-2 border rounded-lg h-32"
                      ></textarea>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Send Message
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              marginRight: "10px",
              position: "fixed",
              bottom: "2rem", // Adjust spacing from the bottom
              right: "0", // Stick to the extreme right
              padding: "0.5rem",
              backgroundColor: "#1e40af",
              color: "white",
              borderRadius: "50%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
