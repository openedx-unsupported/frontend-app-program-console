import ConnectedUploadPage from './UploadPage';
import reducer from './reducers';
import saga from './sagas';
import { configureApiService } from './service';
import { storeName } from './selectors';

export {
  ConnectedUploadPage,
  reducer,
  saga,
  configureApiService,
  storeName,
};
