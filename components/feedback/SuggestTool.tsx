"use client";

import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { categories } from "@/lib/tools/categories";
import type { CategoryId } from "@/lib/tools/types";

export function SuggestTool() {
  const formId = useId();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>(categories[0]?.id ?? "image-tools");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError("Please enter a tool name with at least 3 characters.");
      return;
    }

    if (description.trim().length < 20) {
      setError("Please describe the tool idea in at least 20 characters.");
      return;
    }

    trackEvent("tool_suggestion_submitted", {
      category,
      nameLength: name.trim().length,
      descriptionLength: description.trim().length,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-tm-border bg-tm-soft p-5">
        <h3 className="text-base font-bold text-tm-text">Thanks for the idea</h3>
        <p className="mt-2 text-sm font-medium text-tm-muted">
          Your suggestion was recorded as a browser analytics event only. It is not stored
          in a Tool Base inbox until a suggestions backend is connected.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-tm-border bg-tm-white p-5"
      aria-labelledby={`${formId}-title`}
    >
      <h3 id={`${formId}-title`} className="text-base font-bold text-tm-text">
        Suggest a Tool
      </h3>
      <p className="mt-2 text-sm font-medium text-tm-muted">
        Share a useful utility idea for Tool Base. No personal information is required.
      </p>

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-name`}>
        Proposed tool name
      </label>
      <input
        id={`${formId}-name`}
        className="tm-input mt-2"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Example: HEIC to JPG"
        required
      />

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-category`}>
        Category
      </label>
      <select
        id={`${formId}-category`}
        className="tm-input mt-2"
        value={category}
        onChange={(event) => setCategory(event.target.value as CategoryId)}
      >
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-description`}>
        Why is this useful?
      </label>
      <textarea
        id={`${formId}-description`}
        className="tm-input mt-2 min-h-28 resize-y"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Describe what the tool should do and who it helps."
        required
      />

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-tm-error">
          {error}
        </p>
      ) : null}

      <button type="submit" className="tm-btn tm-btn-primary mt-4">
        Submit suggestion
      </button>
    </form>
  );
}
