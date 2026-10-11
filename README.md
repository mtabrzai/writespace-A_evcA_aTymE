# writespace

writespace is a modern document management and blogging platform built with TypeScript, React, and Vite. Create, organize, and collaborate on documents with ease.

## Features

- **Rich Text Editing**: Create beautiful documents with a powerful Markdown editor
- **Document Organization**: Organize documents with folders, tags, and favorites
- **Real-time Collaboration**: Work together with your team in real-time (coming soon)
- **Easy Sharing**: Share documents with anyone using secure links
- **Powerful Search**: Find any document instantly with advanced search
- **Tagging System**: Categorize documents with custom tags
- **Favorites**: Mark important documents as favorites for quick access
- **Version History**: Track changes and revert to previous versions
- **Admin Dashboard**: Manage users, documents, and posts

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Markdown**: react-markdown + remark-gfm
- **Icons**: react-icons
- **Date Handling**: date-fns
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/writespace.git
   cd writespace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
writespace/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utility functions
│   ├── constants.js       # Application constants
│   ├── router.jsx         # Application router
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies and scripts
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing

Run tests with:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## Deployment

Build for production:

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## License

This project is licensed under the MIT License.