import { useState, useEffect } from "react";
import { API } from "../api";

interface Country {
  id: number;
  name: string;
  clue1: string;
  clue2: string;
  clue3: string;
}

interface FormState {
  name: string;
  clue1: string;
  clue2: string;
  clue3: string;
}

const emptyForm: FormState = { name: "", clue1: "", clue2: "", clue3: "" };

export default function Management() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<FormState>(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [newCountry, setNewCountry] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  async function fetchCountries() {
    setLoading(true);
    const res = await fetch(API.adminCountries);
    const data = await res.json();
    setCountries(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`${API.adminCountries}/${id}`, { method: "DELETE" });
    setCountries((c) => c.filter((x) => x.id !== id));
  }

  function startEdit(country: Country) {
    setEditingId(country.id);
    setEditState({
      name: country.name,
      clue1: country.clue1,
      clue2: country.clue2,
      clue3: country.clue3,
    });
  }

  async function saveEdit(id: number) {
    const res = await fetch(`${API.adminCountries}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editState),
    });
    const updated = await res.json();
    setCountries((c) => c.map((x) => (x.id === id ? updated : x)));
    setEditingId(null);
  }

  async function handleAdd() {
    setError(null);
    if (!newCountry.name || !newCountry.clue1 || !newCountry.clue2 || !newCountry.clue3) {
      setError("All fields are required.");
      return;
    }
    const res = await fetch(API.adminCountries, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCountry),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add country.");
      return;
    }
    const created = await res.json();
    setCountries((c) =>
      [...c, created].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNewCountry(emptyForm);
    setShowAdd(false);
  }

  return (
    <div className="mgmt">
      <div className="mgmt-header">
        <span className="mgmt-count">{countries.length} countries</span>
        <button
          className="mgmt-add-btn"
          onClick={() => {
            setShowAdd((v) => !v);
            setError(null);
          }}
        >
          {showAdd ? "✕ Cancel" : "+ Add Country"}
        </button>
      </div>

      {showAdd && (
        <div className="mgmt-form">
          <h3>New Country</h3>
          {error && <p className="mgmt-error">{error}</p>}
          <input
            placeholder="Country name"
            value={newCountry.name}
            onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
          />
          <input
            placeholder="Clue 1"
            value={newCountry.clue1}
            onChange={(e) => setNewCountry({ ...newCountry, clue1: e.target.value })}
          />
          <input
            placeholder="Clue 2"
            value={newCountry.clue2}
            onChange={(e) => setNewCountry({ ...newCountry, clue2: e.target.value })}
          />
          <input
            placeholder="Clue 3"
            value={newCountry.clue3}
            onChange={(e) => setNewCountry({ ...newCountry, clue3: e.target.value })}
          />
          <button className="mgmt-save-btn" onClick={handleAdd}>
            ✓ Save
          </button>
        </div>
      )}

      {loading ? (
        <p className="status">Loading…</p>
      ) : (
        <ul className="mgmt-list">
          {countries.map((c) =>
            editingId === c.id ? (
              <li key={c.id} className="mgmt-row mgmt-row--editing">
                <input
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                  placeholder="Country name"
                  className="mgmt-input mgmt-input--name"
                />
                <input
                  value={editState.clue1}
                  onChange={(e) => setEditState({ ...editState, clue1: e.target.value })}
                  placeholder="Clue 1"
                  className="mgmt-input"
                />
                <input
                  value={editState.clue2}
                  onChange={(e) => setEditState({ ...editState, clue2: e.target.value })}
                  placeholder="Clue 2"
                  className="mgmt-input"
                />
                <input
                  value={editState.clue3}
                  onChange={(e) => setEditState({ ...editState, clue3: e.target.value })}
                  placeholder="Clue 3"
                  className="mgmt-input"
                />
                <div className="mgmt-row-actions">
                  <button className="mgmt-save-btn" onClick={() => saveEdit(c.id)}>✓ Save</button>
                  <button className="mgmt-cancel-btn" onClick={() => setEditingId(null)}>✕</button>
                </div>
              </li>
            ) : (
              <li key={c.id} className="mgmt-row">
                <div className="mgmt-row-info">
                  <span className="mgmt-row-name">{c.name}</span>
                  <ol className="mgmt-row-clues">
                    <li>{c.clue1}</li>
                    <li>{c.clue2}</li>
                    <li>{c.clue3}</li>
                  </ol>
                </div>
                <div className="mgmt-row-actions">
                  <button className="mgmt-edit-btn" onClick={() => startEdit(c)}>✎ Edit</button>
                  <button className="mgmt-delete-btn" onClick={() => handleDelete(c.id, c.name)}>🗑</button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
