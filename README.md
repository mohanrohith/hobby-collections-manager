# Hobby Collections Manager

A modern web application for managing and organizing various collections like diecast cars, Hot Wheels, LEGO sets, Funko Pops, books, and more.

## Features

- 📱 Responsive web application (mobile + desktop)
- 🔍 Barcode/QR code scanning for quick item addition
- 📚 Support for multiple collection types:
  - Diecast Cars
  - Hot Wheels
  - LEGO sets
  - Funko Pops
  - Books
- 🔄 Automated item details population via public APIs
- 🖼️ Flexible image management
- 🔒 Secure user authentication
- 📊 Category-based organization
- 🔎 Advanced search and filtering
- 📱 Offline support
- 🔄 Real-time sync across devices

## Tech Stack

- Frontend: React with TypeScript
- Backend: Firebase
  - Authentication
  - Firestore (Database)
  - Storage (Images)
  - Cloud Functions (API integrations)
- UI: Tailwind CSS
- State Management: React Context/Redux
- Testing: Jest, React Testing Library, Cypress

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:mohanrohith/hobby-collections-manager.git
   cd hobby-collections-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration details in the `.env` file.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
hobby-collections-manager/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API and Firebase services
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── context/       # React Context providers
│   ├── assets/        # Static assets
│   └── config/        # Configuration files
├── public/            # Public static files
└── tests/             # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Firebase for providing an excellent backend-as-a-service platform
- React team for the amazing frontend framework
- All contributors who will help improve this project
