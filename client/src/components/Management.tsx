import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { API } from "../api";
import type { Country, CountryFormData } from "../types";

const emptyForm: CountryFormData = { name: "", clue1: "", clue2: "", clue3: "" };

export default function Management() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<CountryFormData>(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [newCountry, setNewCountry] = useState<CountryFormData>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API.adminCountries);
      if (!res.ok) throw new Error("Failed to fetch countries.");
      const data: Country[] = await res.json();
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load countries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  /** Returns a change handler that updates a single field in the edit form. */
  function updateEdit(field: keyof CountryFormData) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setEditState((prev) => ({ ...prev, [field]: e.target.value }));
  }

  /** Returns a change handler that updates a single field in the add form. */
  function updateNew(field: keyof CountryFormData) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setNewCountry((prev) => ({ ...prev, [field]: e.target.value }));
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
    setError(null);
    try {
      const res = await fetch(`${API.adminCountries}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editState),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to update country.");
        return;
      }
      const updated: Country = await res.json();
      setCountries((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch {
      setError("Failed to update country.");
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`${API.adminCountries}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete country.");
        return;
      }
      setCountries((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete country.");
    }
  }

  async function handleAdd() {
    setError(null);
    const { name, clue1, clue2, clue3 } = newCountry;
    if (!name.trim() || !clue1.trim() || !clue2.trim() || !clue3.trim()) {
      setError("All fields are required.");
      return;
    }
    try {
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
      const created: Country = await res.json();
      setCountries((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewCountry(emptyForm);
      setShowAdd(false);
    } catch {
      setError("Failed to add country.");
    }
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
          {showAdd ? "Cancel" : "+ Add Country"}
        </button>
      </div>

      {error && <p className="mgmt-error">{error}</p>}

      {showAdd && (
        <div className="mgmt-form">
          <h3>New Country</h3>
          <input placeholder="Country name" value={newCountry.name} onChange={updateNew("name")} />
          <input placeholder="Clue 1" value={newCountry.clue1} onChange={updateNew("clue1")} />
          <input placeholder="Clue 2" value={newCountry.clue2} onChange={updateNew("clue2")} />
          <input placeholder="Clue 3" value={newCountry.clue3} onChange={updateNew("clue3")} />
          <button className="mgmt-save-btn" onClick={handleAdd}>Save</button>
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
                  onChange={updateEdit("name")}
                  placeholder="Country name"
                  className="mgmt-input mgmt-input--name"
                />
                <input
                  value={editState.clue1}
                  onChange={updateEdit("clue1")}
                  placeholder="Clue 1"
                  className="mgmt-input"
                />
                <input
                  value={editState.clue2}
                  onChange={updateEdit("clue2")}
                  placeholder="Clue 2"
                  className="mgmt-input"
                />
                <input
                  value={editState.clue3}
                  onChange={updateEdit("clue3")}
                  placeholder="Clue 3"
                  className="mgmt-input"
                />
                <div className="mgmt-row-actions">
                  <button className="mgmt-save-btn" onClick={() => saveEdit(c.id)}>Save</button>
                  <button className="mgmt-cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
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
                  <button className="mgmt-edit-btn" onClick={() => startEdit(c)}>Edit</button>
                  <button className="mgmt-delete-btn" onClick={() => handleDelete(c.id, c.name)}>Delete</button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
