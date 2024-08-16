export interface Form {
  id: string;
  title: string;
  description: string;
}

export interface Question {
  id: string;
  type: "text" | "mcq";
  question: string;
  options?: string[];
}

export interface FormData {
  title: string;
  questions: Question[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}
