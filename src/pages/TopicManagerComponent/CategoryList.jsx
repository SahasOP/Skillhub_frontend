// CategoryList.jsx - simplified toggle and selection, cleaner event handling
import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Boxes, ChevronDown, ChevronRight, Edit2, Trash2 } from "lucide-react";

const CategoryList = ({ categories, selectedCategoryId, onSelectCategory, onEditCategory, onDeleteCategory }) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  useEffect(() => {
    setExpandedCategoryId(selectedCategoryId);
  }, [selectedCategoryId]);

  const toggleCategory = (category) => {
    onSelectCategory(category);
    setExpandedCategoryId(prev => (prev === category.id ? null : category.id));
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-b from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="text-blue-800">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length ? (
          categories.map(category => (
            <div key={category.id} className="space-y-1">
              <div className="flex items-center justify-between group">
                <Button
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  className={`w-full justify-between ${selectedCategoryId === category.id ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center">
                    <Boxes className="h-4 w-4 mr-2" />
                    {category.name}
                  </div>
                  {expandedCategoryId === category.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                    onClick={e => {
                      e.stopPropagation();
                      onEditCategory(category);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm(`Delete category "${category.name}"?`)) onDeleteCategory(category.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {expandedCategoryId === category.id && (
                <div className="ml-8 pl-2 border-l-2 border-blue-200">
                  {category.topics?.length ? (
                    category.topics.map(topic => (
                      <div
                        key={topic._id}
                        className="py-1 text-sm text-blue-700 cursor-pointer hover:underline"
                        onClick={() => onSelectCategory({ ...category, selectedTopic: topic })}
                      >
                        {topic.title}
                      </div>
                    ))
                  ) : (
                    <div className="py-1 text-sm text-gray-500">No topics</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No categories available. Create your first category above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
