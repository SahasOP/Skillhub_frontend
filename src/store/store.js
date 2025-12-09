

import { configureStore } from "@reduxjs/toolkit"
import authSliceReducer from './Slices/AuthSlice'
import testSliceReducer from './Slices/TestSlice'
import topicSliceReducer from './Slices/TopicSlice'
import studentSliceReducer from './Slices/StudentSlice'
const store = configureStore({
	reducer:{
		auth:authSliceReducer,
		test:testSliceReducer,
		topic:topicSliceReducer,
		student:studentSliceReducer
	},
	devTools:true
})

export default store;