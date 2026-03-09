export interface Country {
  id: number;
  name: string;
  clue1: string;
  clue2: string;
  clue3: string;
}

/** Form data for creating or updating a country (excludes the auto-generated id). */
export type CountryFormData = Omit<Country, "id">;

export interface GuessResult {
  correct: boolean;
  answer: string;
}

export type GameState = "loading" | "playing" | "correct" | "wrong";

export type Tab = "game" | "management";
