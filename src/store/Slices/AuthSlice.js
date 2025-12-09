import toast from "react-hot-toast";
import axiosInstance from "@/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getLocal = key => {
  try {
    const item = localStorage.getItem(key);
    return item === null ? undefined : JSON.parse(item);
  } catch {
    return undefined;
  }
};

const initialState = {
  loading: false,
  error: null,
  students: [],
  teachers: [],
  solvedQuestions: [],
  isLoggedIn: getLocal("isLoggedIn") || false,
  data: getLocal("data") || {},
  role: getLocal("role") || "",
  teacher: "",
};

const showError = (error, fallback) => {
  const msg = error?.response?.data?.message || fallback;
  toast.error(msg);
  return msg;
};

// ---------- AUTH/USER THUNKs ----------
export const registerUser = createAsyncThunk(
  "user/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/signup", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to signup."));
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to login."));
    }
  }
);

export const validateOtp = createAsyncThunk(
  "user/validate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/validate", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to validate OTP."));
    }
  }
);

export const regenerateOtp = createAsyncThunk(
  "user/regenerateOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/regenerate");
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to regenerate OTP."));
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to logout."));
    }
  }
);

// In auth thunk:
export const getUser = createAsyncThunk("auth/getUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/user/me");
    return res.data;
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 404)) {
      // No user logged 
      return {};
    }
    return rejectWithValue(err.response?.data?.message || "Check user failed");
  }
});


export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/forgot", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to request password reset."));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ password, resetToken }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`user/reset/${resetToken}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to reset password."));
    }
  }
);

// ---------- CODING PROFILES THUNKs ----------
export const leetCode = createAsyncThunk("auth/leetcode", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/leetcode/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get LeetCode"));
  }
});

export const codeForces = createAsyncThunk("auth/codeforces", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/codeforces/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get CodeForces"));
  }
});

export const codeChef = createAsyncThunk("auth/codechef", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/codechef/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get CodeChef"));
  }
});

export const geeksForGeeks = createAsyncThunk("auth/geeksforgeeks", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/geeksforgeeks/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get GeeksForGeeks"));
  }
});

export const hackerRank = createAsyncThunk("auth/hackerrank", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`user/hackerrank/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get HackerRank"));
  }
});

export const gitHub = createAsyncThunk("auth/github", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/github/${username}`);
    return res.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      "Failed to get GitHub data";
    toast.error(errorMessage);
    return rejectWithValue({ error: errorMessage });
  }
});

export const codingNinjas = createAsyncThunk("auth/codingninjas", async (username, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`user/codingninjas/${username}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get CodingNinjas"));
  }
});

// ---------- ADMIN/USER MGMT THUNKs ----------
export const getAllStudents = createAsyncThunk("user/getStudents", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("user/getStudents");
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get students"));
  }
});

export const getAllTeachers = createAsyncThunk("user/getTeachers", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("user/getTeachers");
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get teachers"));
  }
});

export const getTeacherById = createAsyncThunk("user/getTeacherById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`user/teacher/${id}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to get teacher"));
  }
});


export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      let response;
      if (data instanceof FormData) {
        response = await axiosInstance.patch(`user/update/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axiosInstance.patch(`user/update/${id}`, data);
      }
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update user";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteUser = createAsyncThunk("user/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/user/deleteUser/${id}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(showError(error, "Failed to delete user"));
  }
});

export const updateStudentSolvedQuestions = createAsyncThunk(
  "user/updateStudentSolvedQuestions",
  async ({ questionId, status }, { getState, rejectWithValue }) => {
    try {
      const userId = getState().auth.data?._id;
      if (!userId) return rejectWithValue("No user found");

      // Must match router: PUT /user/solvedQuestions/:userId
      const res = await axiosInstance.put(`/user/solvedQuestions/${userId}`, {
        questionId, status,
      });
      return res.data.solvedQuestions; // array returned!
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update solved question status"
      );
    }
  }
);


export const fetchSolvedQuestions = createAsyncThunk(
  "user/fetchSolvedQuestions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const authData = getState().auth.data;
      if (!authData || !authData._id) {
        return [];
      }
      const res = await axiosInstance.get(`/user/solvedQuestions/${authData._id}`);
      return res.data?.solvedQuestions || [];
    } catch (error) {
      return rejectWithValue(showError(error, "Failed to fetch solved questions"));
    }
  }
);


// ---------- Slice ----------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        localStorage.setItem("data", JSON.stringify(payload.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", JSON.stringify(payload.user?.role));
        state.isLoggedIn = true;
        state.data = payload.user;
        state.role = payload.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.setItem("isLoggedIn", false);
        localStorage.setItem("data", JSON.stringify({}));
        localStorage.setItem("role", "");
        state.data = {};
        state.role = "";
        state.isLoggedIn = false;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.data = payload.user;
        state.role = payload.user?.role;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.students = action.payload.student;
      })
      .addCase(getAllTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload.student || action.payload.teacher || [];
      })
      .addCase(getTeacherById.fulfilled, (state, action) => {
        state.teacher = action.payload.teacher;
      })
      .addCase(validateOtp.fulfilled, (state, { payload }) => {
        localStorage.setItem("data", JSON.stringify(payload.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", JSON.stringify(payload.user?.role));
        state.data = payload.user;
        state.role = payload.user?.role;
        state.isLoggedIn = true;
      })
      .addCase(fetchSolvedQuestions.fulfilled, (state, action) => {
        state.solvedQuestions = action.payload;
      })
      .addCase(updateStudentSolvedQuestions.fulfilled, (state, action) => {
        state.solvedQuestions = action.payload || [];
      })
      .addCase(updateStudentSolvedQuestions.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export default authSlice.reducer;
