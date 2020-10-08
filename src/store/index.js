import configureStoreProd from './configureStore.prod';
import configureStoreDev from './configureStore.dev';

export default function configureStore(env) {
  if (env === 'production') {
    return configureStoreProd();
  }
  return configureStoreDev();
}
