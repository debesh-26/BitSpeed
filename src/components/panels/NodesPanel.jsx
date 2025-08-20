import React from "react";

/**
 * NodesPanel – shown when nothing is selected
 * ---------------------------------------------
 * Lets user drag & drop a "Message" node to canvas
 */
export default function NodesPanel() {
  const onDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", "message");
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
        Nodes
      </h3>
      <button
        draggable
        onDragStart={onDragStart}
        className="w-full border rounded-xl px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
      >
        <span>💬</span>
        <div>
          <div className="font-medium">Message</div>
          <div className="text-xs text-slate-500">Drag to canvas</div>
        </div>
      </button>
    </div>
  );
}
