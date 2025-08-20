import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import MessageNode from "../nodes/MessageNode.jsx";
import NodesPanel from "../panels/NodesPanel.jsx";
import SettingsPanel from "../panels/SettingsPanel.jsx";

/**
 * BuilderInner
 * ------------
 * Core flow builder logic:
 *  - Handles drag/drop of nodes
 *  - Manages edges and connections
 *  - Persists state in localStorage
 *  - Shows save validation banner
 */
let idCounter = 1;
const getId = () => `node_${idCounter++}`;
const STORAGE_KEY = "bitespeed_flow_builder_state_v1";

export default function BuilderInner() {
  const reactFlowWrapper = useRef(null);

  // React Flow state (nodes + edges)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Currently selected node
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // Load state from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setNodes(parsed.nodes || []);
      setEdges(parsed.edges || []);
      idCounter = parsed.counter || 1;
    } else {
      // Start with one default node
      const firstId = getId();
      setNodes([
        {
          id: firstId,
          type: "message",
          position: { x: 140, y: 180 },
          data: { text: "test message 1" },
        },
      ]);
    }
  }, [setNodes, setEdges]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nodes, edges, counter: idCounter })
    );
  }, [nodes, edges]);

  // Helpers
  const getOutgoingCount = useCallback(
    (nodeId) => edges.filter((e) => e.source === nodeId).length,
    [edges]
  );

  const withValidators = useCallback(
    (list) =>
      list.map((n) => ({
        ...n,
        data: {
          ...n.data,
          validateSource: (connection) => {
            // Allow max ONE outgoing edge
            const out = getOutgoingCount(n.id);
            if (out >= 1) return false;
            // Prevent self-connect
            if (connection.target === n.id) return false;
            return true;
          },
        },
      })),
    [getOutgoingCount]
  );

  // Keep validators updated
  useEffect(() => {
    setNodes((nds) => withValidators(nds));
  }, [edges]);

  // React Flow callbacks
  const onConnect = useCallback(
    (params) => {
      const out = getOutgoingCount(params.source);
      if (out >= 1) return; // ignore extra edges
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds));
    },
    [getOutgoingCount, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 80,
        y: event.clientY - bounds.top - 20,
      };

      if (type === "message") {
        const id = getId();
        setNodes((nds) =>
          nds.concat({
            id,
            type: "message",
            position,
            data: { text: "textNode" },
          })
        );
      }
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  useEffect(() => {
    const clear = () => setSelectedNodeId(null);
    window.addEventListener("clearSelection", clear);
    return () => window.removeEventListener("clearSelection", clear);
  }, []);

  const updateNodeText = useCallback((id, text) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, text } } : n))
    );
  }, []);

  // Save button validation
  const [banner, setBanner] = useState(null);
  const handleSave = useCallback(() => {
    const total = nodes.length;
    const nodesWithNoOutgoing = nodes.filter(
      (n) => getOutgoingCount(n.id) === 0
    );

    if (total > 1 && nodesWithNoOutgoing.length > 1) {
      setBanner({ type: "error", text: "Cannot save Flow" });
      return;
    }

    setBanner({ type: "success", text: "Flow saved" });

    console.log("Saved Flow:", { nodes, edges });
  }, [nodes, edges, getOutgoingCount]);

  const nodeTypes = useMemo(() => ({ message: MessageNode }), []);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white/70 backdrop-blur dark:bg-slate-900/60 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">
            B
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold">Chatbot Flow Builder</div>
            <div className="text-xs text-slate-500">BiteSpeed – Frontend Task</div>
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
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Canvas */}
        <div className="relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={withValidators(nodes)}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background gap={20} />
            <MiniMap pannable zoomable className="!bg-white/80 dark:!bg-slate-800/80" />
            <Controls position="bottom-right" />
          </ReactFlow>

          {/* Floating helper for small screens */}
          <div className="pointer-events-none absolute bottom-3 left-3 hidden sm:block text-xs text-slate-500">
            Drag a node → drop on canvas → connect → click to edit.
          </div>
        </div>

        {/* Side Panel */}
        <aside className="border-t lg:border-t-0 lg:border-l bg-white dark:bg-slate-900 max-h-[50vh] lg:max-h-none lg:h-full overflow-auto">
          {selectedNode ? (
            <SettingsPanel node={selectedNode} onChangeText={updateNodeText} />
          ) : (
            <NodesPanel />
          )}
        </aside>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-2 text-xs text-slate-500 border-t bg-white/60 dark:bg-slate-900/60">
        Source handle → only one edge | Target handle → many edges | Save prevents multiple dangling nodes
      </div>
    </div>
  );
}
