import reducer, {
  // Actions
  setWorkoutType,
  setBpm,
  toggleMetronome,
  setStatus,
  setWorkoutPlan,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
  moveToNextExercise,
  skipCurrentExercise,
  resetWorkout,
  setError,
  clearError,

  // Selectors
  selectStatus,
  selectWorkoutType,
  selectBpm,
  selectMetronomeActive,
  selectCurrentExercise,
  selectRemainingExercises,
  selectCompletedExercises,
  selectInitialWorkoutPlan,
  selectSessionInfo,
  selectError,
  selectTotalExercises,
  selectCompletionPercentage,
  selectIsActive,
  selectIsPaused,
  selectIsFinished,

  // Types
  WorkoutModeType,
  WorkoutItem,
  ExerciseState,

  // Slice
  exerciseSlice,
} from "./exerciseSlice";

// Export actions
export {
  setWorkoutType,
  setBpm,
  toggleMetronome,
  setStatus,
  setWorkoutPlan,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
  moveToNextExercise,
  skipCurrentExercise,
  resetWorkout,
  setError,
  clearError,
};

// Export selectors
export {
  selectStatus,
  selectWorkoutType,
  selectBpm,
  selectMetronomeActive,
  selectCurrentExercise,
  selectRemainingExercises,
  selectCompletedExercises,
  selectInitialWorkoutPlan,
  selectSessionInfo,
  selectError,
  selectTotalExercises,
  selectCompletionPercentage,
  selectIsActive,
  selectIsPaused,
  selectIsFinished,
};

// Export types
export { WorkoutModeType, WorkoutItem, ExerciseState };

// Export slice
export { exerciseSlice };

// Export reducer as default
export default reducer;
