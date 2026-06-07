# Shipping & Sourcing System

A modern, responsive React application for managing shipping operations and supplier sourcing. Built with React 18, Vite, Tailwind CSS, and follows professional enterprise architecture patterns.

## Features

- **Dashboard** - Overview of shipping metrics and KPIs
- **Shipment Management** - Create, track, and manage shipments
- **Supplier Directory** - Manage supplier relationships
- **Quote System** - Procurement quotes and approvals
- **Reports** - Analytics and business reports
- **Real-time Notifications** - Stay updated on shipment status
- **Responsive Design** - Works on desktop, tablet, and mobile
- **PWA Support** - Install as a desktop/mobile app

## Tech Stack

- **Framework**: React 18.x
- **Build Tool**: Vite 6.x
- **Routing**: React Router 7.x
- **Styling**: Tailwind CSS 4.x
- **Charts**: Recharts 2.x
- **Animations**: Framer Motion 12.x
- **Icons**: React Icons (Fa, Hi, Hi2)
- **Notifications**: Sonner
- **Date Utils**: date-fns
- **PDF Generation**: jsPDF + html2canvas
- **PWA**: vite-plugin-pwa + workbox

## Project Structure

```
shipping-sourcing/
├── public/
├── src/
│   ├── api/                  # API client modules
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   ├── home/            # Landing page sections
│   │   ├── layout/          # Layout components
│   │   ├── sections/        # Dashboard sections
│   │   ├── shared/          # Shared components
│   │   └── ui/              # UI primitives
│   ├── context/             # React Context providers
│   ├── hook/                # Custom hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── provider/            # Provider wrappers
│   ├── routes/              # Routing configuration
│   ├── utils/               # Utility modules
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file and configure:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file with:

```env
VITE_BASE_API=http://localhost:8000/api
VITE_APP_NAME=Shipping & Sourcing
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Development

### Adding a New Module

1. Create API module: `src/api/[module]Api.js`
2. Create hooks: `src/hook/use[Module].js`
3. Create pages: `src/pages/[module]/`
4. Update routes in `src/routes/router.jsx`
5. Update sidebar menu in `src/components/ui/sidebarConstruction.jsx`

### Code Conventions

- Components: PascalCase (e.g., `ShipmentList.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useShipment.js`)
- API modules: camelCase (e.g., `shipmentApi.js`)
- Context: PascalCase (e.g., `UserContext.jsx`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
