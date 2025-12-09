import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { PlusCircle, Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import QuestionForm from "./TopicManagerComponent/QuestionForm";  // reuse this for add/edit question
import {
  fetchTopics,
  addTopic,
  updateTopic,
  deleteTopic,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../store/Slices/TopicSlice";

const initialTopicState = {
  icon: "📚",
  title: "",
  description: "",
  color: "bg-blue-500",
  questions: [],
  categoryId: "",
};

const TopicManagerLinear = () => {
  const dispatch = useDispatch();
  const { loading, error, categories: reduxCategories = [] } = useSelector(state => state.topic);

  // State for categories, topics and questions
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [questions, setQuestions] = useState([]);

  // States for CRUD modals/forms
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [addingTopic, setAddingTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicData, setTopicData] = useState(initialTopicState);

  const [addingQuestion, setAddingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [questionFormData, setQuestionFormData] = useState(null);

  // Load categories & topics initially
  useEffect(() => {
    dispatch(getCategories());
    dispatch(fetchTopics());
  }, [dispatch]);

  // Sync categories on redux update
  useEffect(() => {
    setCategories(
      Array.isArray(reduxCategories)
        ? reduxCategories.map(cat => ({ ...cat, id: cat._id }))
        : []
    );
  }, [reduxCategories]);

  // Load topics when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId);
      setTopics(category?.topics || []);
      setSelectedTopicId(null);
      setQuestions([]);
      setAddingTopic(false);
      setEditingTopic(null);
      setAddingQuestion(false);
      setEditingQuestionIndex(null);
      setQuestionFormData(null);
    } else {
      setTopics([]);
      setSelectedTopicId(null);
      setQuestions([]);
    }
  }, [selectedCategoryId, categories]);

  // Load questions when topic changes
  useEffect(() => {
    if (selectedTopicId) {
      const topic = topics.find(t => t._id === selectedTopicId);
      setQuestions(topic?.questions || []);
      setAddingQuestion(false);
      setEditingQuestionIndex(null);
      setQuestionFormData(null);
    } else {
      setQuestions([]);
    }
  }, [selectedTopicId, topics]);

  // CATEGORY HANDLERS ----------------------------------

  const resetCategoryForm = () => {
    setCategoryName("");
    setEditingCategory(null);
    setAddingCategory(false);
  };

  const saveCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ categoryId: editingCategory.id, updatedData: categoryName.trim() })).unwrap();
      } else {
        await dispatch(createCategory({ name: categoryName.trim() })).unwrap();
      }
      dispatch(getCategories());
      resetCategoryForm();
    } catch { }
  };

  const removeCategory = async id => {
    if (!id || !window.confirm("Delete this category and all its contents?")) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(getCategories());
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
        setSelectedTopicId(null);
      }
    } catch { }
  };

  // TOPIC HANDLERS -------------------------------------

  const resetTopicForm = () => {
    setTopicData(initialTopicState);
    setEditingTopic(null);
    setAddingTopic(false);
  };

  const saveTopic = async () => {
    if (!topicData.title.trim() || !topicData.description.trim() || !selectedCategoryId) return;
    try {
      if (editingTopic) {
        await dispatch(updateTopic({ data: topicData, topicId: editingTopic._id, categoryId: selectedCategoryId })).unwrap();
      } else {
        const payload = { ...topicData, title: topicData.title.trim(), description: topicData.description.trim() };
        await dispatch(addTopic({ newTopic: payload, categoryId: selectedCategoryId })).unwrap();
      }
      dispatch(getCategories());
      resetTopicForm();
    } catch { }
  };

  const removeTopic = async topicId => {
    if (!topicId || !selectedCategoryId || !window.confirm("Delete this topic?")) return;
    try {
      await dispatch(deleteTopic({ topicId, categoryId: selectedCategoryId })).unwrap();
      dispatch(getCategories());
      setSelectedTopicId(null);
    } catch { }
  };

  // QUESTION HANDLERS ----------------------------------

  const resetQuestionForm = () => {
    setQuestionFormData(null);
    setAddingQuestion(false);
    setEditingQuestionIndex(null);
  };

  const saveQuestion = async questionData => {
    if (!selectedTopicId || !selectedCategoryId || !questionData) return;
    try {
      if (editingQuestionIndex !== null) {
        await dispatch(updateQuestion({
          categoryId: selectedCategoryId,
          topicId: selectedTopicId,
          questionId: questionData._id,
          updatedQuestion: questionData
        })).unwrap();
      } else {
        await dispatch(addQuestion({
          categoryId: selectedCategoryId,
          topicId: selectedTopicId,
          question: questionData
        })).unwrap();
      }
      dispatch(getCategories());
      dispatch(fetchTopics());
      resetQuestionForm();
    } catch { }
  };

  const removeQuestion = async questionIndex => {
    if (!selectedTopicId || selectedCategoryId === null || questionIndex === null) return;
    if (!window.confirm("Delete this question?")) return;
    try {
      await dispatch(deleteQuestion({
        categoryId: selectedCategoryId,
        topicId: selectedTopicId,
        questionId: questions[questionIndex]._id 
      })).unwrap();
      dispatch(fetchTopics());
      dispatch(getCategories());
      resetQuestionForm();
    } catch { }
  };

  // RENDER ------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-6 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-800">Step 1: Select or Manage Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select onValueChange={setSelectedCategoryId} value={selectedCategoryId ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(addingCategory || editingCategory) ? (
            <div className="flex gap-2 items-center mt-2">
              <Input
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="Category name"
                autoFocus
              />
              <Button variant="outline" onClick={resetCategoryForm}><X className="h-4 w-4" /></Button>
              <Button onClick={saveCategory} disabled={!categoryName.trim()}><Check className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              <Button onClick={() => {
                setAddingCategory(true);
                setEditingCategory(null);
                setCategoryName("");
              }} size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Add Category
              </Button>
              {selectedCategoryId && (
                <>
                  <Button onClick={() => {
                    const cat = categories.find(c => c.id === selectedCategoryId);
                    setEditingCategory(cat);
                    setAddingCategory(false);
                    setCategoryName(cat?.name || "");
                  }} size="sm" variant="outline" className="flex items-center gap-1">
                    <Edit2 className="h-4 w-4" /> Edit
                  </Button>
                  <Button onClick={() => removeCategory(selectedCategoryId)} size="sm" variant="destructive" className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TOPICS SELECT & FORM */}
      {selectedCategoryId && (
        <Card className="mb-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-800">Step 2: Select or Manage Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedTopicId} value={selectedTopicId ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Topic" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {topics.map(t => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(addingTopic || editingTopic) ? (
              <>
                <div className="space-y-3 mt-2">
                  <Input
                    placeholder="Icon (Emoji)"
                    name="icon"
                    value={topicData.icon}
                    onChange={e => setTopicData({ ...topicData, icon: e.target.value })}
                  />
                  <Input
                    placeholder="Title"
                    name="title"
                    value={topicData.title}
                    onChange={e => setTopicData({ ...topicData, title: e.target.value })}
                  />
                  <Input
                    placeholder="Color class"
                    name="color"
                    value={topicData.color}
                    onChange={e => setTopicData({ ...topicData, color: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    name="description"
                    value={topicData.description}
                    onChange={e => setTopicData({ ...topicData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <CardFooter className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={resetTopicForm}><X className="h-4 w-4" /></Button>
                  <Button onClick={saveTopic} disabled={!topicData.title.trim() || !topicData.description.trim()}>
                    <Check className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Button onClick={() => {
                  setAddingTopic(true);
                  setEditingTopic(null);
                  setTopicData(initialTopicState);
                }} size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Add Topic
                </Button>
                {selectedTopicId && (
                  <>
                    <Button onClick={() => {
                      const t = topics.find(t => t._id === selectedTopicId);
                      setEditingTopic(t);
                      setAddingTopic(false);
                      setTopicData(t || initialTopicState);
                    }} size="sm" variant="outline" className="flex items-center gap-1">
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                    <Button onClick={() => removeTopic(selectedTopicId)} size="sm" variant="destructive" className="flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* QUESTIONS MANAGEMENT */}
      {selectedTopicId && !addingQuestion && editingQuestionIndex === null && (
        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-800">Step 3: Manage Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-end">
              <Button onClick={() => { setAddingQuestion(true); setQuestionFormData(null); }} size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <p className="text-center text-gray-500">No questions available.</p>
            ) : (
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <li key={i} className="border p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{q.problem}</p>
                      <p className="text-sm text-gray-700">Difficulty: {q.difficulty}</p>
                      <p className="text-sm text-gray-700">Time: {q.timeComplexity}, Space: {q.spaceComplexity}</p>
                      {q.practice && (
                        <a href={q.practice} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          Practice Link
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingQuestionIndex(i);
                          setQuestionFormData(q);
                          setAddingQuestion(false);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeQuestion(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* QUESTION FORM */}
      {(addingQuestion || editingQuestionIndex !== null) && (
        <Card className="rounded-lg shadow-md mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-800">
              {editingQuestionIndex !== null ? "Edit Question" : "Add Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm
              initialData={questionFormData}
              onSubmit={saveQuestion}
              onCancel={() => resetQuestionForm()}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TopicManagerLinear;
