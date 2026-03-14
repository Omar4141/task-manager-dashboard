# Task Manager Dashboard 🚀

A modern **Task Manager Dashboard** built with **React, Vite, and Tailwind CSS** that helps users organize tasks, track progress, and stay productive.
The application includes an **AI-powered chatbot assistant** that can answer questions about tasks and suggest what to work on next.

---

# ✨ Features

### 🧩 Task Management

* Create and manage tasks
* Organize tasks by status:

  * To Do
  * In Progress
  * Completed
* Set task priority (Low, Medium, High)
* Track progress across tasks

### 🤖 AI Chatbot Assistant

An integrated chatbot that helps users manage their tasks.

The assistant can:

* Suggest what task to work on next
* Show high priority tasks
* Count completed tasks
* Show tasks currently in progress
* Answer basic questions about the dashboard
* Provide productivity tips

The chatbot uses:

for intelligent responses im still working on* **Google Gemini AI API** 
* A **fallback local logic system** so the chatbot still works even without an API key

### 📊 Dashboard Overview

* Overview panel showing task statistics
* Visual charts using Recharts
* Clear productivity insights

### 🎨 Modern UI

* Built with **Tailwind CSS**
* Smooth animations with **Framer Motion**
* Clean SaaS-style layout
* Responsive design

### 🧲 Drag & Drop Tasks

Tasks can be reordered and moved between columns using **dnd-kit**.

---

# 🛠 Tech Stack

* React
* Vite
* Tailwind CSS
* Framer Motion
* dnd-kit
* Recharts
* React Icons
* Google Gemini AI "soon"

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Omar4141/task-manager-dashboard.git
```

Navigate to the project:

```bash
cd task-manager-dashboard
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=My_api_key_here
```

i will generate a Gemini API key from **Google AI Studio**.

If the API key is not provided, the chatbot will automatically use a **local fallback assistant**.
---

# 💬 Example Chatbot Questions

You can ask the assistant:

```
What should I work on next?
How many tasks have I completed?
Show my high priority tasks
What tasks are in progress?
Do I have any tasks due soon?
What does this dashboard do?
```
note: Gemini API key option not avaliable now i will upgrade it later
---

# 👨‍💻 Author

**Omar Ahmed Omar**
