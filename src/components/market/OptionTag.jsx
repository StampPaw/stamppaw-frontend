import React from "react";

export function OptionTag({ option, selected, onSelect }) {
  const values = option.value.split(",").map((v) => v.trim());

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onSelect(option.name, v)}
          className={`
            px-3 py-1 rounded-full border text-xs 
            ${
              selected === v
                ? "bg-primary text-white border-primary"
                : "bg-bg text-text border-primary/20"
            }
          `}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
