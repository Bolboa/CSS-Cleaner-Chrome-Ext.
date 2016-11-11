import {combineReducers} from 'redux';

import states from './reducer-states';

const allReducers = combineReducers({
	users:states
});

export default allReducers;