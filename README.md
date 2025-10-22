# Auto Finance UI

A modern Angular 20 application for auto financing services with TypeScript, Tailwind CSS, and reactive forms.

## Features

- Auto finance simulator with brand, vehicle, and tax calculations
- Responsive design with Tailwind CSS
- Reactive forms with validation
- Mock services for development
- Professional project structure

## Prerequisites

- Node.js (v18.0.0+)
- npm (v8.0.0+)
- Angular CLI (v20.0.0+)


## Installation

```bash
git clone <repository-url>
cd auto-finance-ui
npm install
```

## Development

```bash
npm start
# Navigate to http://localhost:4200/
```

## Build

```bash
npm run build    # Production build
npm test         # Run tests
npm run lint     # Run linting
```

## Project Structure

```
src/app/
├── simulator-auto-financial/    # Main auto finance simulator
│   ├── brand/                   # Brand selection
│   ├── vehicle/                 # Vehicle selection
│   └── taxes/                   # Tax calculations
├── services/                    # API and mock services
├── types/                       # TypeScript definitions
└── components/                  # Reusable components
```

## Auto Finance Simulator

The application provides a comprehensive finance simulator with:

- Brand and vehicle selection
- Tax and fee calculations
- Loan modeling and payment calculations
- Multi-step form validation



## Technology Stack

- **Angular 20** with standalone components
- **TypeScript** with strict type checking  
- **Tailwind CSS** for responsive design
- **Reactive Forms** for validation
- **ESLint** for code quality

## License

MIT License