import React from "react";
import { ReactFlowProvider } from "reactflow";
import BuilderInner from "./components/builder/BuilderInner.jsx";

export default function App() {
  return (
    <ReactFlowProvider>
      <BuilderInner />
    </ReactFlowProvider>
  );
}
