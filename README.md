# Hobby Collections Manager

A modern web application to help collectors catalog and organize various collections (diecast cars, Hot Wheels, LEGO, Funko Pops, books, etc.) in a streamlined, user-friendly way.

## Features

- 📱 Responsive web application (mobile + desktop)
- 🔍 Barcode/QR code scanning for quick item addition
- 🤖 Automated item details population via API lookups
- 📂 Category-based organization and browsing
- 🔎 Advanced search and filtering capabilities
- 🖼️ Flexible image handling with auto-fetch and custom uploads
- 🔄 Real-time sync across devices
- 🔒 Secure user authentication and data protection

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore (Database)
  - Storage (Images)
  - Cloud Functions (API integrations)
- **Development Tools**:
  - ESLint + Prettier for code quality
  - TypeScript for type safety
  - Git for version control

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- VS Code (recommended) with ESLint and Prettier extensions

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/mohanrohith/hobby-collections-manager.git
   cd hobby-collections-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes ESLint issues
- `npm run format` - Formats code using Prettier

## Development Workflow

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your branch and create a pull request:

   ```bash
   git push origin feature/your-feature-name
   ```

4. After review and approval, merge your changes into main.

## Project Structure

```
hobby-collections-manager/
├── public/                 # Static files
├── src/                    # Source files
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API and service functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── context/           # React context providers
│   ├── assets/            # Images, fonts, etc.
│   └── config/            # Configuration files
├── tests/                 # Test files
└── prompts/              # Project documentation and requirements
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Firebase for providing an excellent backend-as-a-service platform
- React team for the amazing frontend framework
- All contributors who will help improve this project
