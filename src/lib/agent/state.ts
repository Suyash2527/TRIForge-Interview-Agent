export interface InterviewState {
  questionsAsked: number;
  distinctDaysCovered: number[];
  isComplete: boolean;
}

export function initializeState(): InterviewState {
  return {
    questionsAsked: 0,
    distinctDaysCovered: [],
    isComplete: false,
  };
}
