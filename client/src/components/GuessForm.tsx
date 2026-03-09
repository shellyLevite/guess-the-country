import { useState } from "react";
import type { FormEvent } from "react";

export interface GuessFormProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
}

export default function GuessForm({ onSubmit, disabled }: GuessFormProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter country name…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Submit Guess
      </button>
    </form>
  );
}
