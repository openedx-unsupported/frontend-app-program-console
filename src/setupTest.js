/* eslint-disable import/no-extraneous-dependencies */

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.LMS_BASE_URL = 'http://localhost:18000';
process.env.REGISTRAR_API_BASE_URL = 'http://localhost:18734/api';
