import React from "react";
import { Handle, Position } from "reactflow";

/**
 * MessageNode – custom node UI
 * --------------------------------------
 * - Displays message text with a header
 * - Has one SOURCE handle (only one outgoing allowed)
 * - Has one TARGET handle (can accept many incoming)
 */
export default function MessageNode({ id, data, selected }) {
  return (
    <div
      className={`rounded-2xl shadow-sm border relative bg-white dark:bg-slate-800 transition ring-2 ${
        selected ? "ring-indigo-400" : "ring-transparent"
      }`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between px-4 py-2 rounded-t-2xl bg-teal-100 dark:bg-teal-900/40 border-b">
        <div className="flex items-center gap-2 font-semibold text-teal-900 dark:text-teal-100">
          <span>💬</span>
          <span>Send Message</span>
        </div>
        <span className="text-emerald-600">🟢</span>
      </div>

      {/* Node content */}
      <div className="px-4 py-3 text-slate-700 dark:text-slate-100 min-w-[220px]">
        <div className="whitespace-pre-wrap">{data.text || "(empty)"}</div>
      </div>

      {/* Handles */}
      <Handle
        id="t"
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-slate-500"
      />
      <Handle
        id="s"
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-slate-500"
        isValidConnection={data.validateSource}
      />
    </div>
  );
}
