"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const [newName, setNewName] = useState("");
  const [newNameBn, setNewNameBn] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameBn, setEditNameBn] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!newName.trim() || !newNameBn.trim()) {
      setError("Please fill in both the English and Bengali name.");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, name_bn: newNameBn }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add category");
        setAdding(false);
        return;
      }
      setNewName("");
      setNewNameBn("");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditNameBn(cat.name_bn);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    if (!editName.trim() || !editNameBn.trim()) {
      setError("Please fill in both the English and Bengali name.");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, name_bn: editNameBn }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save changes");
        setSavingEdit(false);
        return;
      }
      setEditingId(null);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Delete "${name}"? Products in this category won't be deleted — they'll just become uncategorized.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete category");
        setDeletingId(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-2xl">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-hairline">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-elevated text-left text-secondary">
              <th className="px-4 py-3 font-medium">Name (English)</th>
              <th className="px-4 py-3 font-medium">Name (Bengali)</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-secondary">
                  No categories yet — add one below.
                </td>
              </tr>
            )}

            {categories.map((cat) => {
              const isEditing = editingId === cat.id;
              return (
                <tr key={cat.id} className="border-b border-hairline last:border-0">
                  {isEditing ? (
                    <>
                      <td className="px-4 py-2.5">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border border-hairline bg-elevated px-3 py-1.5 text-sm outline-none focus:border-[color:var(--accent)]"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          value={editNameBn}
                          onChange={(e) => setEditNameBn(e.target.value)}
                          className="w-full rounded-lg border border-hairline bg-elevated px-3 py-1.5 text-sm outline-none focus:border-[color:var(--accent)]"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          disabled={savingEdit}
                          className="mr-4 text-[color:var(--accent-glow)] hover:underline disabled:opacity-50"
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-secondary hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-[color:var(--text-primary)]">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-secondary">{cat.name_bn}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => startEdit(cat)}
                          className="mr-4 text-[color:var(--accent-glow)] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={deletingId === cat.id}
                          className="text-red-400 hover:underline disabled:opacity-50"
                        >
                          {deletingId === cat.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-4 flex flex-col gap-3 rounded-2xl border border-dashed border-hairline p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1.5 block text-xs text-secondary">
            New category — English name
          </label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Power Banks"
            className="w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs text-secondary">
            Bengali name
          </label>
          <input
            value={newNameBn}
            onChange={(e) => setNewNameBn(e.target.value)}
            placeholder="e.g. পাওয়ার ব্যাংক"
            className="w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="rounded-full px-5 py-2 text-sm font-medium text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.02]"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          {adding ? "Adding…" : "Add category"}
        </button>
      </form>
    </div>
  );
}
