
# Journal App

## Description
A web app for journaling and note-taking, built as a learning project using React (Vite) and json-server.

## Features
- Create projects, within which one can create notes.
- Edit, delete, star and pin both projects and notes.
- Archive and recover deleted projects.
- Theme switching.

## Samples

### Light Theme
![Light Theme](git-images/light-theme.png)

### Dark Theme
![Dark Theme](git-images/dark-theme.png)

## Future Updates
- Reordering notes.
- Note types (dividers, headings, bold, underline, cross-through, italics).
- Switch from json-server prototype to MongoDB.

## Installation

### Prerequisites
Please ensure you have the following installed on your system:

- Node.js (this project has been built with v24.14.0)
- npm

1. Clone Repository

git clone https://github.com/FaheemFHM/journal-app.git
cd journal-app

2. Install Dependencies

npm install

3. Run Mock Backend

json-server --watch db.json --port 5000

4. Run Frontend

npm run dev

