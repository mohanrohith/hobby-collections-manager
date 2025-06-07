import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Easy Collection Management',
    description:
      'Organize your collections with an intuitive interface. Add, edit, and manage your items effortlessly.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
  },
  {
    title: 'Smart Item Recognition',
    description:
      'Upload images of your items and let our AI automatically identify and categorize them.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Multiple Collection Types',
    description:
      'Support for various collection types including Books, LEGO sets, Funko Pops, and Diecast Cars.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: 'Advanced Search & Filtering',
    description: 'Find your items quickly with powerful search and filtering capabilities.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
];

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-sm">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
              <span className="sr-only">Hobby Collections Manager</span>
              <svg
                className="h-8 w-auto"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Logo background */}
                <rect width="40" height="40" rx="8" fill="#4f46e5" />

                {/* Collection box icon */}
                <g transform="translate(8, 8)">
                  {/* Box outline */}
                  <rect
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    rx="2"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Box lid */}
                  <path d="M0 8 L24 8" stroke="white" strokeWidth="2" />

                  {/* Collection items */}
                  <circle cx="6" cy="4" r="1.5" fill="white" />
                  <circle cx="12" cy="4" r="1.5" fill="white" />
                  <circle cx="18" cy="4" r="1.5" fill="white" />

                  {/* Bottom items */}
                  <rect x="4" y="12" width="4" height="4" rx="1" fill="white" />
                  <rect x="10" y="12" width="4" height="4" rx="1" fill="white" />
                  <rect x="16" y="12" width="4" height="4" rx="1" fill="white" />
                </g>
              </svg>
              <span className="text-xl font-semibold text-gray-900">Hobby Collections Manager</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Manage Your Collections with Ease
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                The ultimate platform for collectors. Organize, track, and showcase your collections
                with our powerful tools and AI-powered features.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  to="/signup"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started
                </Link>
                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                  Sign in <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <svg
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                viewBox="0 0 2432 1442"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="2432" height="1442" fill="#f8fafc" />

                {/* Abstract grid pattern */}
                <g stroke="#e2e8f0" strokeOpacity="0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 72} x2="2432" y2={i * 72} />
                  ))}
                  {Array.from({ length: 34 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 72} y1="0" x2={i * 72} y2="1442" />
                  ))}
                </g>

                {/* Collection cards */}
                <g transform="translate(200, 200)">
                  {/* Card 1 */}
                  <rect
                    x="0"
                    y="0"
                    width="300"
                    height="400"
                    rx="8"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <rect x="20" y="20" width="260" height="200" rx="4" fill="#f1f5f9" />
                  <rect x="20" y="240" width="180" height="24" rx="4" fill="#f1f5f9" />
                  <rect x="20" y="280" width="120" height="16" rx="4" fill="#f1f5f9" />

                  {/* Card 2 */}
                  <rect
                    x="340"
                    y="0"
                    width="300"
                    height="400"
                    rx="8"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <rect x="360" y="20" width="260" height="200" rx="4" fill="#f1f5f9" />
                  <rect x="360" y="240" width="180" height="24" rx="4" fill="#f1f5f9" />
                  <rect x="360" y="280" width="120" height="16" rx="4" fill="#f1f5f9" />

                  {/* Card 3 */}
                  <rect
                    x="680"
                    y="0"
                    width="300"
                    height="400"
                    rx="8"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <rect x="700" y="20" width="260" height="200" rx="4" fill="#f1f5f9" />
                  <rect x="700" y="240" width="180" height="24" rx="4" fill="#f1f5f9" />
                  <rect x="700" y="280" width="120" height="16" rx="4" fill="#f1f5f9" />
                </g>

                {/* Decorative elements */}
                <g fill="#4f46e5" fillOpacity="0.1">
                  <circle cx="400" cy="800" r="100" />
                  <circle cx="2000" cy="600" r="150" />
                  <circle cx="1800" cy="1000" r="80" />
                </g>

                {/* Accent lines */}
                <g stroke="#4f46e5" strokeWidth="1" strokeOpacity="0.2">
                  <path d="M0,800 Q1216,600 2432,800" />
                  <path d="M0,1000 Q1216,1200 2432,1000" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Collectors
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools you need to manage your collections effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col group hover:bg-gray-50 p-6 rounded-lg transition-all duration-300"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white group-hover:bg-indigo-500 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="mt-32 sm:mt-56">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Managing Your Collections Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of collectors who trust our platform to manage their valuable
            collections.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/signup"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign up for free
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-white">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-32">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2024 Hobby Collections Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
