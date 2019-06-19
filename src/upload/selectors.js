export const storeName = 'upload';

// Pass everything in state as props for now
export const uploadSelector = state => ({ ...state[storeName] });
