import React from "react";


export default function Topbar({ banner, onSave }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white/70 backdrop-blur dark:bg-slate-900/60 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">
          B
        </div>
        <div className="hidden sm:block">
          <div className="font-semibold">Chatbot Flow Builder</div>
          <div className="text-xs text-slate-500">BiteSpeed</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {banner && (
          <div
            className={`text-xs px-3 py-1.5 rounded-full border ${
              banner.type === "error"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {banner.text}
          </div>
        )}
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
