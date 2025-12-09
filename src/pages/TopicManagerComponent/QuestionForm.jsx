// QuestionForm.jsx - improved reusability and handles controlled inputs cleanly

import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Loader2, Plus } from "lucide-react";

const difficulties = [
  { value: "Easy", label: "Easy", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "Hard", label: "Hard", color: "bg-red-100 text-red-800" },
];

const initialQuestionState = {
  problem: "",
  practice: "",
  difficulty: "Easy",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
};

const getSafeInitialData = (data) => ({
  ...initialQuestionState,
  ...data,
});

const QuestionForm = ({ onSubmit, initialData, loading, onCancel }) => {
  const [question, setQuestion] = React.useState(getSafeInitialData(initialData || {}));
  useEffect(() => {
    setQuestion(getSafeInitialData(initialData || {}));
  }, [initialData]);

  const updateField = (field, value) => setQuestion(q => ({ ...q, [field]: value }));

  const isValid = question.problem.trim();

  return (
    <div className="space-y-4">
      <Input label="Problem Name" value={question.problem} onChange={e => updateField("problem", e.target.value)} placeholder="Enter problem name" />
      <Input label="Practice URL" value={question.practice} onChange={e => updateField("practice", e.target.value)} placeholder="Enter practice URL" />
      <Select value={question.difficulty} onValueChange={value => updateField("difficulty", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map(d => (
            <SelectItem key={d.value} value={d.value} className={d.color}>{d.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input label="Time Complexity" value={question.timeComplexity} onChange={e => updateField("timeComplexity", e.target.value)} placeholder="O(n)" />
      <Input label="Space Complexity" value={question.spaceComplexity} onChange={e => updateField("spaceComplexity", e.target.value)} placeholder="O(n)" />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button onClick={() => onSubmit(question)} disabled={!isValid || loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          {initialData ? "Update Question" : "Add Question"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;
