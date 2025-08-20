# 🤖 Chatbot Flow Builder

A **React + Vite + TailwindCSS + React Flow** project that allows users to visually build chatbot flows.  
Nodes can be dragged onto the canvas, connected, and customized with messages.  
This project was built as a frontend assignment and demonstrates skills in **state management, drag & drop, custom nodes, and flow validation**.

---

## 🚀 Live Demo
👉 [View Live Project](https://bit-speed.vercel.app/)


---

## ✨ Features
- 🎨 **Drag & Drop** nodes onto the canvas
- 🔗 **Connect nodes** with edges (only one outgoing edge per node)
- ✏️ **Edit node text** in a side settings panel
- 💾 **Save validation** (prevents multiple disconnected nodes)
- 💡 **Persistent state** using `localStorage`
- 📱 **Responsive layout** with TailwindCSS
- ⚡ Built with **Vite** for fast development

---

## 🛠️ Tech Stack
- **React 18**
- **Vite**
- **React Flow**
- **TailwindCSS**
- **LocalStorage** (for persistence)

---

## 📂 Project Structure

src/
 ├─ components/
 │   ├─ nodes/
 │   │   └─ MessageNode.jsx     # Custom chatbot message node
 │   ├─ panels/
 │   │   ├─ NodesPanel.jsx      # Panel with draggable nodes
 │   │   └─ SettingsPanel.jsx   # Node editing panel
 │   ├─ builder/
 │   │   └─ BuilderInner.jsx    # Main flow builder logic
 │   └─ ui/
 │       └─ Topbar.jsx          # Reusable top navigation bar
 ├─ App.jsx                     # Wraps everything with ReactFlowProvider
 ├─ index.css                   # Tailwind entry styles
 └─ main.jsx                    # React entry point

 
---

## ⚙️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/chatbot-flow-builder.git
   cd chatbot-flow-builder
2. **Install dependencies**
    npm install

3. **Run the development server**
    npm run dev
