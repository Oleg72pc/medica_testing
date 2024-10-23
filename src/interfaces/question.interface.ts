import { QuestionCategory } from "../types/QuestionCategory.enum.ts"

export interface Question {
    question: string;
    answers: string[];
    correctIndexes: number[];
    category: QuestionCategory;
}
