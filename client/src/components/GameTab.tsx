import ClueCard from "./ClueCard";
import GuessForm from "./GuessForm";
import type { GameState, GuessResult } from "../types";

interface GameTabProps {
  gameState: GameState;
  clues: string[];
  result: GuessResult | null;
  onGuess: (guess: string) => void;
  onPlayAgain: () => void;
}

export default function GameTab({
  gameState,
  clues,
  result,
  onGuess,
  onPlayAgain,
}: GameTabProps) {
  if (gameState === "loading") {
    return <p className="status">Loading clues…</p>;
  }

  return (
    <>
      <ClueCard clues={clues} />
      <GuessForm onSubmit={onGuess} disabled={gameState !== "playing"} />

      {gameState === "correct" && (
        <div className="result-banner correct">
          <span className="result-icon">🎉</span>
          <p className="result-text">Correct!</p>
        </div>
      )}

      {gameState === "wrong" && result && (
        <div className="result-banner wrong">
          <span className="result-icon">❌</span>
          <p className="result-text">Not quite!</p>
          <p className="result-answer">
            The correct answer is <strong>{result.answer}</strong>
          </p>
        </div>
      )}

      {(gameState === "correct" || gameState === "wrong") && (
        <button className="new-game-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      )}
    </>
  );
}
