import packageJson from '../package.json';

// ----------------------------------------------------------------------

// Define a type for route paths
export type RoutesConfig = {
  home: string;
  login: string;
  // Add more routes as needed
};

// Define a type for API endpoints
export type ApiConfig = {
  login: string;
  // Add more API endpoints as needed
};

// Define a type for server configuration
export type ServerConfig = {
  url: string;
  port: number;
};

export type ConfigValue = {
  appName: string;
  appVersion: string;
  routes: RoutesConfig;
  api: ApiConfig;
  server: ServerConfig;
};

// ----------------------------------------------------------------------

// Define the actual routes
const ROUTES: RoutesConfig = {
  home: '/',
  login: '/login',
  // Add more routes as needed
};

// Define the actual API endpoints
const API: ApiConfig = {
  login: '/api/login',
  // Add more API endpoints as needed
};

// Define the server configuration
export const CFG_SERVER: ServerConfig = {
  url: 'http://localhost', // Default server URL, adjust as needed
  port: 3010, // Default server port, adjust as needed
};

export const CONFIG: ConfigValue = {
  appName: 'Leady',
  appVersion: packageJson.version,
  routes: ROUTES,
  api: API,
  server: CFG_SERVER,
};
