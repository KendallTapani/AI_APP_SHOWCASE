export type GeneratedSchedule = {
  authors: Author[]; 
  books: Book[];
};

export type Author = {
  name: string;

};

export type Book = {
  description: string;
  summary: string; // New field for book summary
};