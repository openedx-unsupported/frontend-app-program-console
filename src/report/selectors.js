export const storeName = 'report';

// Pass everything in state as props for now
export const reportSelector = state => ({ ...state[storeName] });
