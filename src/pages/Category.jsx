import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Sidebar from "@/custom/Sidebar";
import SubHeading from "@/custom/StudentSubheading";
import { getCategories } from "../store/Slices/TopicSlice";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.topic);

  const [displayCategories, setDisplayCategories] = useState([]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    setDisplayCategories(categories);
    console.log(categories, "categories");
  }, [categories]);

  const handleCategorySelect = (categoryId) => {
    navigate(`/learning-path/${categoryId}`);
  };

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`; // Slightly lighter pastel for better contrast
  };

  const getCategoryIcon = (icon, name) => {
    const iconMap = {
      array: "🧮",
      string: "📜",
      linkedlist: "🔗",
      stack: "📚",
      queue: "↪️",
      tree: "🌳",
      graph: "🕸️",
      recursion: "🔄",
      dp: "🧩",
      greedy: "🤲",
      search: "🔍",
      sort: "🔢",
      backtracking: "🔙",
      bit: "🔧",
      math: "➗",
      hash: "🔑",
    };

    if (icon) return icon;

    const lowerName = (name || "").toLowerCase();
    for (const [key, value] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }

    return "📘"; // Default icon
  };

  return (
    <div className="flex">
      <div className="h-screen fixed">
        <Sidebar />
      </div>

      <div className="w-full">
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              All Categories
            </h1>
            <p className="text-gray-600">
              Select a category to explore topics and practice problems. Master
              each category to build a strong foundation in Data Structures and
              Algorithms.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCategories.length > 0 ? (
                displayCategories.map((category) => {
                  const bgColor = category.color || getRandomPastelColor();
                  const icon = getCategoryIcon(category.icon, category.name);
                  return (
                    <Card
                      key={category._id}
                      className="cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
                      onClick={() => handleCategorySelect(category._id)}
                      aria-label={`Select category ${category.name}`}
                    >
                      <CardContent>
                        <div
                          className="text-4xl flex items-center justify-center rounded-full w-16 h-16 mb-4 text-white"
                          style={{ backgroundColor: bgColor }}
                        >
                          <span role="img" aria-label={`${category.name} icon`}>
                            {icon}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-600">
                          {category.description ||
                            `Explore topics and resources for ${category.name}.`}
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                          {category.topics?.length ?? 0} topics available
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No categories available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
