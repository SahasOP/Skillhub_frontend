// TopicList.jsx - clean and minimal, just selecting and displaying topics
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Plus } from "lucide-react";


const TopicList = ({ topics, selectedTopicId, onSelectTopic, onAddTopic, selectedCategory }) => {
  const availableTopics = Array.isArray(topics) ? topics : [];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-b from-blue-50 to-white">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-blue-800">{selectedCategory ? `${selectedCategory.name} Topics` : "Topics"}</CardTitle>
        {selectedCategory && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onAddTopic}>
            <Plus className="mr-2 h-4 w-4" /> Add Topic
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {availableTopics.length ? (
          availableTopics.map(topic => (
            <Button
              key={topic._id}
              variant={selectedTopicId === topic._id ? "default" : "outline"}
              className={`w-full justify-start ${selectedTopicId === topic._id ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
              onClick={() => onSelectTopic(topic)}
            >
              <span className="mr-2">{topic.icon}</span>
              {topic.title}
              <Badge variant={selectedTopicId === topic._id ? "secondary" : "outline"} className="ml-auto">
                {topic.questions?.length || 0}
              </Badge>
            </Button>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {selectedCategory ? "No topics available for this category" : "Select a category to view topics"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicList;
