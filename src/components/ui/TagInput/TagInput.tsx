'use client';
import React, { useEffect, useRef, useState } from "react";

export interface Tag
{
    id?: string | number;
    title: string;
}

export interface TagInputProps
{
    value?: Tag[];
    onChange?: (tags: Tag[]) => void;
    placeholder?: string;
    suggestions?: Tag[];
    maxTags?: number;
    allowDuplicates?: boolean;
    name?: string; // for form data
    defaultTags?: Tag[];
}

export default function TagInput({
    onChange,
    placeholder = "Add a tag and press Enter",
    suggestions = [],
    maxTags = 50,
    allowDuplicates = false,
    name = "tags",
    defaultTags = []
}: TagInputProps)
{
    const [tags, setTags] = useState<Tag[]>(defaultTags);
    const [input, setInput] = useState("");
    const [openSuggestions, setOpenSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() =>
    {
        if (!input)
        {
            setFilteredSuggestions([]);
            return;
        }
        const q = input.toLowerCase();
        setFilteredSuggestions(
            suggestions
                .filter(
                    (s) =>
                        s.title.toLowerCase().includes(q) &&
                        (allowDuplicates || !tags.some((t) => t.title === s.title))
                )
                .slice(0, 8)
        );
    }, [input, suggestions, tags, allowDuplicates]);

    const notify = (next: Tag[]) =>
    {
        onChange?.(next);
    };

    const addTag = (raw: Tag | string) =>
    {
        const title = typeof raw === "string" ? raw.trim() : raw.title.trim();
        if (!title) return;
        if (!allowDuplicates && tags.some((t) => t.title === title)) return;
        if (tags.length >= maxTags) return;

        const tag: Tag =
            typeof raw === "string"
                ? { id: `${Date.now()}-${title}`, title }
                : raw;

        const next = [...tags, tag];
        setTags(next);
        notify(next);
        setInput("");
        setOpenSuggestions(false);
    };

    const removeTag = (index: number) =>
    {
        const next = tags.filter((_, i) => i !== index);
        setTags(next);
        notify(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    {
        if (e.key === "Enter" || e.key === ",")
        {
            e.preventDefault();
            input
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((p) => addTag(p));
        } else if (e.key === "Backspace" && !input && tags.length)
        {
            removeTag(tags.length - 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) =>
    {
        const pasted = e.clipboardData.getData("text");
        if (pasted.includes(",") || pasted.includes("\n") || pasted.includes(" "))
        {
            e.preventDefault();
            pasted
                .split(/[,\n\s]+/)
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((p) => addTag(p));
        }
    };

    const onSuggestionClick = (s: Tag) =>
    {
        addTag(s);
    };

    return (
        <div className="w-full relative">
            <div
                className="min-h-[44px] flex flex-wrap items-center gap-2 px-2 py-2 border rounded-md focus-within:ring-2 focus-within:ring-offset-1"
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map((t, i) => (
                    <span
                        key={t.id}
                        className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-sm"
                    >
                        <span className="select-none">{t.title}</span>
                        <button
                            type="button"
                            onClick={(e) =>
                            {
                                e.stopPropagation();
                                removeTag(i);
                            }}
                            aria-label={`Remove ${t.title}`}
                            className="text-xs leading-none px-1"
                        >
                            ✕
                        </button>
                    </span>
                ))}

                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) =>
                    {
                        setInput(e.target.value);
                        setOpenSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={tags.length ? "" : placeholder}
                    className="flex-1 min-w-[120px] outline-none p-1 text-sm"
                />
            </div>

            {/* Hidden input for form submission */}
            <input
                type="hidden"
                name={name}
                value={JSON.stringify(tags)} // now stores full tag objects
            />

            {openSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute mt-1 w-full max-h-48 overflow-auto border rounded-md bg-white ring-1 z-10">
                    {filteredSuggestions.map((s) => (
                        <li
                            key={s.id}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                            onMouseDown={(e) => e.preventDefault()} // prevent blur
                            onClick={() => onSuggestionClick(s)}
                        >
                            {s.title}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-1 text-xs text-gray-500">
                Press Enter or comma to add a tag. Backspace removes last tag.
            </div>
        </div>
    );
}
