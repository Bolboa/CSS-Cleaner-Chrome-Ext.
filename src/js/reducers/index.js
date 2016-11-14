import {combineReducers} from 'redux';

import states from './reducer-states';
import SourceCode from './reducer-listener';

const allReducers = combineReducers({
	source: SourceCode
});

export default allReducers;