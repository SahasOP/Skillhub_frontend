// CategoryCard.jsx
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ChevronRight } from "lucide-react";

const CategoryCard = ({ category, topics, onSelectCategory, isSelected }) => {
  const topicCount = topics.filter(topic => topic.categoryId === category.id).length;
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={() => onSelectCategory(category)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{category.name}</span>
          <ChevronRight className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{topicCount} topics</p>
      </CardContent>
    </Card>
  );
};

// TopicsList.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";

const TopicsList = ({ 
  category, 
  topics, 
  onSelectTopic, 
  onAddTopic, 
  newTopic, 
  handleInputChange, 
  isSubmitting, 
  editingTopicId 
}) => {
  const categoryTopics = topics.filter(topic => topic.categoryId === category.id);

  const handleAddTopic = () => {
    onAddTopic();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Topics in {category.name}</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="absolute top-1/2 left-1/2 bg-white transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] w-[90vw] md:w-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Add Topic to {category.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <Input
                name="icon"
                value={newTopic.icon}
                onChange={handleInputChange}
                placeholder="Icon (emoji)"
              />
              <Input
                name="title"
                value={newTopic.title}
                onChange={handleInputChange}
                placeholder="Title"
                required
              />
              <Input
                name="color"
                value={newTopic.color}
                onChange={handleInputChange}
                placeholder="Color class (e.g., bg-blue-500)"
              />
              <Textarea
                name="description"
                value={newTopic.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <DialogClose>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAddTopic}
                  disabled={
                    isSubmitting || !newTopic.title || !newTopic.description
                  }
                >
                  {isSubmitting ? "Adding..." : editingTopicId ? "Update Topic" : "Add Topic"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {categoryTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryTopics.map((topic) => (
              <Button
                key={topic._id}
                variant="outline"
                className="h-auto py-3 justify-start text-left flex flex-col items-start"
                onClick={() => onSelectTopic(topic)}
              >
                <div className="flex items-center w-full">
                  <span className="mr-2">{topic.icon}</span>
                  <span className="font-semibold">{topic.title}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1 truncate w-full">
                  {topic.description.length > 60 
                    ? `${topic.description.substring(0, 60)}...` 
                    : topic.description}
                </p>
                <div className="text-xs mt-2">
                  {topic.questions?.length || 0} questions
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No topics in this category yet</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="absolute top-1/2 left-1/2 bg-white transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] w-[90vw] md:w-[500px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Add First Topic to {category.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <Input
                    name="icon"
                    value={newTopic.icon}
                    onChange={handleInputChange}
                    placeholder="Icon (emoji)"
                  />
                  <Input
                    name="title"
                    value={newTopic.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                  />
                  <Input
                    name="color"
                    value={newTopic.color}
                    onChange={handleInputChange}
                    placeholder="Color class (e.g., bg-blue-500)"
                  />
                  <Textarea
                    name="description"
                    value={newTopic.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose>
                      <Button variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleAddTopic}
                      disabled={
                        isSubmitting || !newTopic.title || !newTopic.description
                      }
                    >
                      {isSubmitting ? "Adding..." : "Add Topic"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { CategoryCard, TopicsList };