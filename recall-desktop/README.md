# 🚀 Problem Statement

Millions of students and professionals spend countless hours reading PDFs.

Traditional PDF readers only allow users to:

- Read
- Highlight
- Bookmark

They **do not help users understand or remember the content.**

Common problems include:

- Forgetting what was read
- Difficulty understanding technical papers
- Switching between ChatGPT and the PDF
- No intelligent revision system
- Manual note-taking
- Time-consuming summarization

Reading a PDF should feel like learning with a personal tutor—not flipping through static pages.

---

# 💡 Our Solution

#Mesh.AI brings AI directly into the reading experience.

Instead of opening multiple applications, users can:

- 📄 Read PDFs
- 🤖 Ask AI questions
- 📝 Take notes
- 🖍 Highlight important content
- 📚 Generate flashcards
- ❓ Generate quizzes
- 📖 Summarize chapters
- 📊 Track reading progress

Everything happens inside one modern desktop application.

---

# ✨ Why Mesh.AI is Different

Unlike traditional PDF readers, RecallPDF focuses on **learning**, not just reading.

| Traditional PDF Reader | RecallPDF |
|-------------------------|-----------|
| Read PDFs | AI-powered learning |
| Manual notes | Smart notes |
| Basic highlights | AI-assisted highlights |
| No memory | Recall system |
| No quizzes | Auto-generated quizzes |
| No flashcards | AI flashcards |
| No explanations | Explain any paragraph instantly |

---

# ✨ Features

### 📄 Smart PDF Reader
- Open and view PDF documents
- Smooth page navigation
- Zoom in/out
- Bookmark pages
- Search within PDFs

### 🤖 AI Assistant
- Ask questions about the PDF
- Explain difficult concepts
- Summarize pages and chapters
- Simplify technical content
- Translate selected text

### 📝 Smart Notes
- Create page-wise notes
- Sticky notes
- Auto-save notes
- Organize notes for quick revision

### 🖍 Highlights
- Highlight important text
- Multiple highlight colors
- Manage and review highlights

### 📚 AI Learning Tools
- Generate flashcards
- Create practice quizzes
- Extract key points
- Build revision material automatically

### 📊 Progress Tracking
- Track reading progress
- Continue from the last page
- Monitor study sessions

### 💻 Desktop Experience
- Native desktop application
- Fast performance
- Modern UI
- Cross-platform support

---

# 🛠️ Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

## Desktop
- Electron

## PDF Engine
- PDF.js

## State Management
- Zustand

## AI (Planned)
- OpenAI API
- Ollama
- Google Gemini
- Anthropic Claude

## Development Tools
- ESLint
- Prettier
- Git & GitHub

# 📂 Project Structure

```text
recall-desktop/
│
├── 📁 electron/                    # 🔧 Electron Backend (Runs in Node.js)
│   ├── main.cjs                    # Main Electron process. Creates windows, handles file dialogs, reads PDFs.
│   └── preload.cjs                 # Secure IPC bridge. Exposes Electron APIs to the React frontend.
│
├── 📁 src/                         # ⚛️ React Frontend (Runs in Chromium)
│   ├── 📁 assets/                  # Static assets (images, fonts, icons)
│   ├── App.tsx                     # Main application component. Manages overall UI and layout.
│   ├── main.tsx                    # React entry point. Mounts the application.
│   ├── index.css                   # Global styles and Tailwind CSS directives.
│   └── vite-env.d.ts               # TypeScript definitions for Vite and Electron APIs.
│
├── 📁 dist/                        # 📦 Production build output (Generated automatically)
│   ├── index.html                  # Compiled HTML entry point
│   └── assets/                     # Bundled JavaScript, CSS and static assets
│
├── 📁 public/                      # 🌐 Static files copied directly during build
│
├── 📁 node_modules/                # 📦 Installed dependencies (Auto-generated)
│
├── 📄 package.json                 # Project metadata, dependencies and npm scripts
├── 📄 package-lock.json            # Dependency lock file for consistent installs
├── 📄 vite.config.ts               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 tsconfig.json                # Base TypeScript configuration
├── 📄 tsconfig.app.json            # TypeScript configuration for React
├── 📄 tsconfig.node.json           # TypeScript configuration for Electron/Vite
├── 📄 index.html                   # HTML entry point for React
├── 📄 .gitignore                   # Files and folders ignored by Git
├── 📄 LICENSE                      # MIT (OSI-approved) Open Source License
└── 📄 README.md                    # Project documentation
```
---

# 📜 License

This project is licensed under the **MIT License**, an **OSI-approved open-source license**.

You are free to:

- ✅ Use the software for personal or commercial purposes
- ✅ Modify the source code
- ✅ Distribute copies
- ✅ Create derivative works
- ✅ Use it in private or public projects

The only requirement is that the original copyright notice and license remain included in all copies or substantial portions of the software.

