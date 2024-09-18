export {};

declare global {
  interface URLConstructor {
    canParse?(url: string): boolean;
  }

  // Extending the global URL object
  const URL: URLConstructor;
}
