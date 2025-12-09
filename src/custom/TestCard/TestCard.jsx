import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const TestCard = ({ test, onStart, onViewResult, isCompleted }) => (
  <Card className="mb-4">
    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h3 className="text-xl font-bold">{test.title}</h3>
        <p className="text-gray-500">{test.description}</p>
        <p className="text-sm text-gray-400">Created: {new Date(test.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2 mt-3 md:mt-0">
        {isCompleted ? (
          <Button onClick={() => onViewResult(test)} variant="outline" className="text-blue-700 border-blue-700">View Result</Button>
        ) : (
          <Button onClick={() => onStart(test)} className="bg-blue-600 text-white">Start Test</Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default TestCard;
