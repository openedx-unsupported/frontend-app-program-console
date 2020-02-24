import ConnectedConsolePage from './ConsolePage';
import reducer from './reducers';
import saga from './sagas';
import { configureApiService } from './service';
import { storeName } from './selectors';

export {
  ConnectedConsolePage,
  reducer,
  saga,
  configureApiService,
  storeName,
};
