import {combineReducers} from 'redux';

import SourceCode from './reducer-source-listener';
import CSSSource  from './reducer-css-listener';

const allReducers = combineReducers({
	source: SourceCode,
	css:CSSSource
});

export default allReducers;