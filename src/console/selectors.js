export const storeName = 'console';

// Pass everything in state as props for now
export const consoleSelector = state => ({ ...state[storeName] });
