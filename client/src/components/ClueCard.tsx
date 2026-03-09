export interface ClueCardProps {
  clues: string[];
}

export default function ClueCard({ clues }: ClueCardProps) {
  return (
    <div className="clue-card">
      <h2>Clues</h2>
      <ul>
        {clues.map((clue, index) => (
          <li key={index}>
            <span className="clue-number">Clue {index + 1}:</span> {clue}
          </li>
        ))}
      </ul>
    </div>
  );
}
