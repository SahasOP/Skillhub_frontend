import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const createStudent = createAsyncThunk('student/create', async (studentData, { rejectWithValue }) => {
  try {
    const res = await axios.post('/student/create', studentData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getStudents = createAsyncThunk('student/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/student/getall');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getStudentById = createAsyncThunk('student/getById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/student/getStudentById/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateStudent = createAsyncThunk('student/update', async ({ id, studentData }, { rejectWithValue }) => {
  try {
    const res = await axios.patch(`/student/updateStudent/${id}`, studentData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteStudent = createAsyncThunk('student/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/student/deleteStudent/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchStudent = createAsyncThunk('student/me', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/student/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateStudentSolvedQuestions = createAsyncThunk('student/updateSolvedQuestions', async ({ questionId, status }, { rejectWithValue }) => {
  try {
    const res = await axios.patch('/student/updateSolvedQuestions', { questionId, status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Slice
const studentSlice = createSlice({
  name: 'student',
  initialState: {
    studentList: [],    // all students
    student: null,      // single student (mine or queried)
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createStudent.fulfilled, (state, action) => {
        state.studentList.push(action.payload);
      })
      // READ ALL
      .addCase(getStudents.fulfilled, (state, action) => {
        state.studentList = action.payload;
      })
      // READ ONE
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.student = action.payload;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.student = action.payload;
      })
      // UPDATE
      .addCase(updateStudent.fulfilled, (state, action) => {
        // update in list if list is loaded
        const idx = state.studentList.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.studentList[idx] = action.payload;
        // Also update student if it matches id
        if (state.student && state.student._id === action.payload._id)
          state.student = action.payload;
      })
      .addCase(updateStudentSolvedQuestions.fulfilled, (state, action) => {
        state.student = action.payload;
      })
      // DELETE
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.studentList = state.studentList.filter(s => s._id !== action.payload._id);
        // Remove from "student" if that's deleted
        if (state.student && state.student._id === action.payload._id)
          state.student = null;
      })
      // --- UNIVERSAL pending/rejected matchers for loading & error ---
      .addMatcher(
        action => action.type.startsWith('student/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.startsWith('student/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        action => action.type.startsWith('student/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export default studentSlice.reducer;
