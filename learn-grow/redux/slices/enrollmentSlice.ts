import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnrolledCourse {
    courseId: string;
    enrolledAt: string;
    /**
     * The number of COMPLETED LESSONS - a count, not a percentage.
     * `completionPercentage` is the 0-100 percentage.
     */
    progress: number;
    /** 0-100. Use this for anything shown as a percentage. */
    completionPercentage: number;
    completed: boolean;
}

interface EnrollmentState {
    enrolledCourses: EnrolledCourse[];
}

const initialState: EnrollmentState = {
    enrolledCourses: [],
};

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        enrollInCourse: (state, action: PayloadAction<{ courseId: string }>) => {
            const exists = state.enrolledCourses.find(
                (e) => e.courseId === action.payload.courseId
            );
            if (!exists) {
                state.enrolledCourses.push({
                    courseId: action.payload.courseId,
                    enrolledAt: new Date().toISOString(),
                    progress: 0,
                    completionPercentage: 0,
                    completed: false,
                });
            }
        },
        updateProgress: (
            state,
            action: PayloadAction<{
                courseId: string;
                progress: number;
                completionPercentage?: number;
            }>
        ) => {
            const course = state.enrolledCourses.find(
                (e) => e.courseId === action.payload.courseId
            );
            if (course) {
                course.progress = action.payload.progress;
                // The percentage is what the UI shows; `progress` is a count.
                course.completionPercentage =
                    action.payload.completionPercentage ?? course.completionPercentage;
                if (course.completionPercentage >= 100) {
                    course.completed = true;
                }
            }
        },
        unenrollFromCourse: (state, action: PayloadAction<{ courseId: string }>) => {
            state.enrolledCourses = state.enrolledCourses.filter(
                (e) => e.courseId !== action.payload.courseId
            );
        },
        loadEnrollments: (state, action: PayloadAction<EnrolledCourse[]>) => {
            state.enrolledCourses = action.payload;
        },
    },
});

export const { enrollInCourse, updateProgress, unenrollFromCourse, loadEnrollments } =
    enrollmentSlice.actions;
export default enrollmentSlice.reducer;
