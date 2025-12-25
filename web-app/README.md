# MilkMan Web UI

Modern, elegant web application for managing milk delivery operations.

## Features

- 🏠 **Dashboard** - Overview with real-time statistics
- 👥 **Customer Management** - Complete CRUD operations
- 📦 **Product Catalog** - Manage milk products
- 🛒 **Order Processing** - Track and manage orders
- 📅 **Subscriptions** - Recurring delivery management

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: Spring Boot API (port 8081)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

The app runs on `http://localhost:3001` and proxies API requests to the Spring Boot backend at `http://localhost:8081/milkman`.

### Project Structure

```
MilkManWeb/
├── src/
│   ├── components/     # Reusable components
│   │   └── Layout.jsx  # Main layout with navigation
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Customers.jsx
│   │   ├── Products.jsx
│   │   ├── Orders.jsx
│   │   └── Subscriptions.jsx
│   ├── services/       # API integration
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Integration

All API calls are configured in `src/services/api.js` and automatically proxy through Vite to the backend.

## Design Features

- ✨ Modern gradient UI
- 📱 Fully responsive design
- 🎨 Custom color scheme (green theme)
- 🔄 Smooth transitions and animations
- 📊 Card-based layouts
- 🎯 Intuitive navigation

## License

Copyright © 2025 MilkMan. All rights reserved.
