import React from "react";

/**
 * SettingsPanel – shown when a node is selected
 * ------------------------------------------------
 * Allows user to edit message text of a node
 */
export default function SettingsPanel({ node, onChangeText }) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <button
          className="btn btn-ghost text-sm px-0 text-slate-500"
          onClick={() => window.dispatchEvent(new CustomEvent("clearSelection"))}
        >
          ← Back
        </button>
        <h3 className="text-sm font-semibold text-slate-500 ml-auto uppercase tracking-wide">
          Message
        </h3>
      </div>

      <label className="text-xs text-slate-500 mb-1">Text</label>
      <textarea
        className="w-full rounded-xl border p-3 min-h-[140px] bg-white dark:bg-slate-900"
        placeholder="Type message..."
        value={node.data.text}
        onChange={(e) => onChangeText(node.id, e.target.value)}
      />

      <div className="mt-3 text-xs text-slate-500">
        Edit the message content of this node.
      </div>
    </div>
  );
}
