import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Instagram, ArrowLeft } from "lucide-react";
import Sidebar, { SidebarItem } from "@/custom/Sidebar";
import SubHeading from "@/custom/Subheading";
import { LifeBuoy, Receipt, Boxes, Package, UserCircle, BarChart3, LayoutDashboard, Settings, Users, Target, Trophy, Award, Download, Search, ArrowUpDown } from "lucide-react";
// Import images
import sahas from "../assets/Sahas.png";
import aryaan from "../assets/Aryaan.jpeg.jpg";
// import creator3 from "../assets/Aryaan.jpeg.jpg"; // Add your image
// import creator4 from "../assets/Aryaan.jpeg.jpg"; // Add your image

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Sahas Prajapati",
      role: "Full Stack Developer",
      description: "Passionate developer creating seamless and engaging digital experiences.",
      image: sahas,
      skills: ["React", "Node.js", "MongoDB", "TailwindCSS"],
      socials: {
        linkedin: "https://www.linkedin.com/in/sahasprajapati/",
        github: "https://github.com/SahasOP/",
      },
    },
    {
      name: "Aryaan Gala",
      role: "Frontend Developer",
      description: "Enthusiastic developer dedicated to developing dynamic web experiences.",
      image: aryaan,
      skills: ["React", "TypeScript", "UI/UX Design", "Next.js"],
      socials: {
        linkedin: "https://www.linkedin.com/in/aryaangala/",
        github: "https://github.com/AryaanGala1406/",
      },
    },
    // {
    //   name: "Creator 3",
    //   role: "Backend Developer",
    //   description: "Innovative problem solver with a passion for complex system architecture.",
    //   image: creator3,
    //   skills: ["Python", "Django", "AWS", "Microservices"],
    //   socials: {
    //     instagram: "#",
    //     linkedin: "#",
    //     github: "#",
    //   },
    // },
    // {
    //   name: "Creator 4",
    //   role: "UI/UX Designer",
    //   description: "Creative designer transforming ideas into intuitive and beautiful interfaces.",
    //   image: creator4,
    //   skills: ["Figma", "Adobe XD", "Design Systems", "User Research"],
    //   socials: {
    //     instagram: "#",
    //     linkedin: "#",
    //     github: "#",
    //   },
    // },
  ];

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.1 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen fixed left-0 bg-white border-r border-gray-200">
        <Sidebar>
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert />
          <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
          <SidebarItem icon={<UserCircle size={20} />} text="Users" />
          <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
          <SidebarItem icon={<Package size={20} />} text="Orders" alert />
          <SidebarItem icon={<Receipt size={20} />} text="Billings" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </Sidebar>
      </div>
      <div className="w-full">
        <SubHeading />
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Creative Team</h2>
              <p className="mt-4 text-xl text-gray-600">Innovative minds driving digital transformation</p>
              {/* <Link 
            to="/" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
          </Link> */}
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
              {teamMembers.map((member, index) => (
                <motion.div key={index} variants={cardVariants} whileHover="hover" className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl perspective-1000">
                  <div className="relative group">
                    <img src={member.image} alt={member.name} className="w-full h-64 object-cover object-center transform transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4 h-20">{member.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2 h-16">
                        {member.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-4 justify-center">
                      <motion.a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-blue-700 hover:text-blue-800 transition-colors">
                        <Linkedin className="h-6 w-6" />
                      </motion.a>
                      <motion.a href={member.socials.github} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-gray-800 hover:text-black transition-colors">
                        <Github className="h-6 w-6" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
