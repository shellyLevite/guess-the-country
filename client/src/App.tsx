import { useState, useEffect, useCallback } from "react";
import ClueCard from "./components/ClueCard";
import GuessForm from "./components/GuessForm";
import { API } from "./api";
import "./App.css";

type GameState = "loading" | "playing" | "correct" | "wrong";

interface GuessResult {
  correct: boolean;
  answer: string;
}

export default function App() {
  const [clues, setClues] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("loading");
  const [result, setResult] = useState<GuessResult | null>(null);

  const fetchCountry = useCallback(async () => {
    setGameState("loading");
    setResult(null);
    try {
      const res = await fetch(API.country);
      const data = await res.json();
      setClues(data.clues);
      setGameState("playing");
    } catch {
      console.error("Failed to load country. Is the server running?");
    }
  }, []);

  useEffect(() => {
    fetchCountry();
  }, [fetchCountry]);

  async function handleGuess(guess: string) {
    try {
      const res = await fetch(API.guess, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
      });
      const data: GuessResult = await res.json();
      setResult(data);
      setGameState(data.correct ? "correct" : "wrong");
    } catch {
      console.error("Failed to submit guess.");
    }
  }

  return (
    <div className="app">
      <h1>🌍 Guess The Country</h1>

      {gameState === "loading" && <p className="status">Loading clues…</p>}

      {(gameState === "playing" ||
        gameState === "correct" ||
        gameState === "wrong") && (
        <>
          <ClueCard clues={clues} />

          <GuessForm
            onSubmit={handleGuess}
            disabled={gameState !== "playing"}
          />

          {gameState === "correct" && (
            <p className="result correct">✅ Correct!</p>
          )}

          {gameState === "wrong" && result && (
            <p className="result wrong">
              ❌ Wrong. The correct answer is <strong>{result.answer}</strong>.
            </p>
          )}

          {(gameState === "correct" || gameState === "wrong") && (
            <button className="new-game-btn" onClick={fetchCountry}>
              🔄 New Game
            </button>
          )}
        </>
      )}
    </div>
  );
}
