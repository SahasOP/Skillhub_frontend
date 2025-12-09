import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/Helpers/axiosInstance";
import { toast } from "react-hot-toast";

const initialState = {
  topics: [],
  categories: [],
  loading: false,
  error: null,
};

// Helper for error handling
const showError = (error, fallback = "Something went wrong") => {
  const msg = error?.response?.data?.message || fallback;
  toast.error(msg);
  return msg;
};

// Thunks

// Fetch all topics (flat across categories)
export const fetchTopics = createAsyncThunk(
  "topic/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/topics",
        {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to fetch topics."));
    }
  }
);

// Fetch all categories
export const getCategories = createAsyncThunk(
  "topic/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/categories", {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to fetch categories."));
    }
  }
);

// Fetch category by id
export const getCategoryById = createAsyncThunk(
  "topic/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to fetch category by ID."));
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "topic/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/category", categoryData);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to create category."));
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "topic/updateCategory",
  async ({ categoryId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/category/${categoryId}`, updatedData);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to update category."));
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "topic/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/category/${categoryId}`);
      return { id: categoryId };
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to delete category."));
    }
  }
);

// Fetch topics by category id
export const getTopicsByCategoryId = createAsyncThunk(
  "topic/getTopicsByCategoryId",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/${categoryId}/topics`);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to fetch topics by category ID."));
    }
  }
);

// Create topic within category
export const addTopic = createAsyncThunk(
  "topic/addTopic",
  async ({ newTopic, categoryId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/category/${categoryId}/topics`, newTopic);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to add topic."));
    }
  }
);

// Update topic within category
export const updateTopic = createAsyncThunk(
  "topic/updateTopic",
  async ({ data, topicId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/category/${categoryId}/topics/${topicId}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to update topic."));
    }
  }
);

// Delete topic within category
export const deleteTopic = createAsyncThunk(
  "topic/deleteTopic",
  async ({ topicId, categoryId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/category/${categoryId}/topics/${topicId}`);
      return { topicId };
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to delete topic."));
    }
  }
);

// Add question to a topic in a category
export const addQuestion = createAsyncThunk(
  "topic/addQuestion",
  async ({ categoryId, topicId, question }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/category/${categoryId}/topics/${topicId}/questions`, question);
      return response.data;
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to add question."));
    }
  }
);

// Update question in a topic in a category
export const updateQuestion = createAsyncThunk(
  "topic/updateQuestion",
  async ({ categoryId, topicId, questionId, updatedQuestion }, { rejectWithValue }) => {
    console.log(categoryId, topicId, questionId, updatedQuestion);
    if (!categoryId || !topicId || (!questionId && questionId != 0)) {
      return rejectWithValue("All IDs required for update");
    }
    try {
      const response = await axiosInstance.put(
        `/category/${categoryId}/topics/${topicId}/questions/${questionId}`,
        updatedQuestion
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update question."
      );
    }
  }
);


// Delete question from a topic in a category
export const deleteQuestion = createAsyncThunk(
  "topic/deleteQuestion",
  async ({ categoryId, topicId, questionId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/category/${categoryId}/topics/${topicId}/questions/${questionId}`);
      return { questionId, topicId };
    } catch (err) {
      return rejectWithValue(showError(err, "Failed to delete question."));
    }
  }
);
const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        // Some APIs return { data: [...] }, adjust as needed
        state.topics = action.payload.data || action.payload || [];
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTopic.fulfilled, (state, action) => {
        if (action.payload?.topics && action.payload._id) {
          const catIndex = state.categories.findIndex(c => c._id === action.payload._id);
          if (catIndex !== -1) {
            state.categories[catIndex].topics = action.payload.topics;
          } else {
            state.categories.push(action.payload);
          }
        }
      })

      .addCase(updateTopic.fulfilled, (state, action) => {
        if (action.payload?.topics && action.payload._id) {
          const catIndex = state.categories.findIndex(c => c._id === action.payload._id);
          if (catIndex !== -1) {
            state.categories[catIndex].topics = action.payload.topics;
          }
        }
      })

      .addCase(deleteTopic.fulfilled, (state, action) => {
        if (action.payload?.topicId) {
          state.categories = state.categories.map(cat => ({
            ...cat,
            topics: cat.topics?.filter(topic => topic._id !== action.payload.topicId) || [],
          }));
          // Optionally also remove from topics array if maintained separately
          state.topics = state.topics.filter(t => t._id !== action.payload.topicId);
        }
      })

      // Questions
      .addCase(addQuestion.fulfilled, (state, action) => {
        // Assuming API returns updated topic or category with topics
        // Ideally, update the topic questions in state accordingly
        if (action.payload?.topic) {
          // Replace or update that topic in topics array
          const idx = state.topics.findIndex(t => t._id === action.payload.topic._id);
          if (idx !== -1) {
            state.topics[idx] = action.payload.topic;
          } else {
            state.topics.push(action.payload.topic);
          }
        }
      })

      .addCase(updateQuestion.fulfilled, (state, action) => {
        // Update questions in topics array
        if (action.payload?._id) {
          const topicIndex = state.topics.findIndex(t => t._id === action.payload._id);
          if (topicIndex !== -1) {
            state.topics[topicIndex] = action.payload;
          }
        }
      })

      .addCase(deleteQuestion.fulfilled, (state, action) => {
        // Remove question from topic's questions
        if (action.payload?.questionId && action.payload?.topicId) {
          const topicIndex = state.topics.findIndex(t => t._id === action.payload.topicId);
          if (topicIndex !== -1) {
            const topic = state.topics[topicIndex];
            topic.questions = topic.questions?.filter(q => q._id !== action.payload.questionId) || [];
            state.topics[topicIndex] = { ...topic };
          }
        }
      })

      // Categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Some APIs might return differently structured data, adjust accordingly
        state.categories = action.payload.categories || action.payload || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories.push(action.payload);
        }
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload?._id) {
          const idx = state.categories.findIndex(c => c._id === action.payload._id);
          if (idx !== -1) {
            state.categories[idx] = action.payload;
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.categories = state.categories.filter(c => c._id !== action.payload.id);
        }
      })

      .addCase(getCategoryById.fulfilled, (state, action) => {
        // Optionally store selected category for detailed view if applicable
      })

      .addCase(getTopicsByCategoryId.fulfilled, (state, action) => {
        if (action.payload?.topics) {
          state.topics = action.payload.topics;
        }
      })

      // Global loading and error matchers to unify handling
      .addMatcher(
        action => action.type.startsWith("topic/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.startsWith("topic/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        action => action.type.startsWith("topic/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export default topicSlice.reducer;