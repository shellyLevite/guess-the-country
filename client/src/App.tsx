import { useState, useEffect, useCallback } from "react";
import GameTab from "./components/GameTab";
import Management from "./components/Management";
import { API } from "./api";
import type { Tab, GameState, GuessResult } from "./types";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("game");
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

  const handleGuess = useCallback(async (guess: string) => {
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
  }, []);

  return (
    <div className={`page ${activeTab === "management" ? "page--manage" : ""}`}>
      <div className="app">
        <header className="app-header">
          <h1>
            🌍 <span className="title-gradient">Guess The Country</span>
          </h1>
          <nav className="tabs">
            <button
              className={`tab ${activeTab === "game" ? "tab--active" : ""}`}
              onClick={() => setActiveTab("game")}
            >
              🎮 Game
            </button>
            <button
              className={`tab ${activeTab === "management" ? "tab--active" : ""}`}
              onClick={() => setActiveTab("management")}
            >
              ⚙️ Manage
            </button>
          </nav>
        </header>

        {activeTab === "game" && (
          <GameTab
            gameState={gameState}
            clues={clues}
            result={result}
            onGuess={handleGuess}
            onPlayAgain={fetchCountry}
          />
        )}

        {activeTab === "management" && <Management />}
      </div>
    </div>
  );
}
