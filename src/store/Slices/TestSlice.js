import axiosInstance from "@/Helpers/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  error: null,
  testById: null,
  tests: [],
  appearedTest: {},
  marks: "",
  currentTest: "",
  markbytest: "",
};

const showError = (error, fallback = "Failed to process request.") => {
  const msg = error?.response?.data?.message || fallback;
  toast.error(msg);
  return msg;
};

export const createTest = createAsyncThunk(
  "test/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("test/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to create test."));
    }
  }
);

export const getTestsbyTeacherid = createAsyncThunk(
  "test/getTestsByTeacherid",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("test/getTestsByTeacherid");
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch tests."));
    }
  }
);

export const getTests = createAsyncThunk(
  "test/getall",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("test/getall");
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch tests."));
    }
  }
);

export const getTestByid = createAsyncThunk(
  "test/getTestByid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`test/getTestbyId/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch test details."));
    }
  }
);

export const submitTest = createAsyncThunk(
  "test/submitTest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("test/submitTest", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to submit test."));
    }
  }
);

export const getTestsByStudentId = createAsyncThunk(
  "test/getTestsByStudentId",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`test/student/${studentId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch tests."));
    }
  }
);

export const getMarksbystudentid = createAsyncThunk(
  "test/getMarksbystudentid",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("test/marks", {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch marks."));
    }
  }
);

export const getCurrentTestMarks = createAsyncThunk(
  "test/getCurrentTestMarks",
  async (test_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`test/getcurrentmarks/${test_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch current test marks."));
    }
  }
);

export const getmarksbytestId = createAsyncThunk(
  "test/getmarksbytestId",
  async (test_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`test/getmarksfortestid/${test_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch marks by test ID."));
    }
  }
);

export const editTest = createAsyncThunk(
  "test/editTest",
  async ({ data, testId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/test/editTest/${testId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to update test."));
    }
  }
);

export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`test/deleteTest/${testId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to delete test."));
    }
  }
);

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTestsbyTeacherid.fulfilled, (state, action) => {
        console.log("getTestsbyTeacherid payload:", action.payload);
        state.tests = action.payload.data || [];;
      })
      .addCase(getTests.fulfilled, (state, action) => {
        state.tests = action.payload.data || action.payload.tests || [];
      })
      .addCase(getTestsByStudentId.fulfilled, (state, action) => {
        console.log("getTestsbyTeacherid payload:", action.payload);
        state.tests = action.payload.data || action.payload.tests || [];
      })
      .addCase(getTestByid.fulfilled, (state, action) => {
        state.testById = action.payload.data;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.appearedTest = action.payload.testData;
      })
      .addCase(getMarksbystudentid.fulfilled, (state, action) => {
        state.marks = action.payload.data || action.payload.marks;
      })
      .addCase(getCurrentTestMarks.fulfilled, (state, action) => {
        state.currentTest = action.payload.data;
      })
      .addCase(getmarksbytestId.fulfilled, (state, action) => {
        state.marks = action.payload.marks;
      });
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      }
    );
    builder.addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state) => {
        state.loading = false;
        state.error = null;
      }
    );
  },
});

export default testSlice.reducer;
