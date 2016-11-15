import {combineReducers} from 'redux';

import SourceCode from './reducer-source-listener';
import CSSSource  from './reducer-css-listener';
import CSSSelected  from './reducer-css-chosen';

const allReducers = combineReducers({
	source: SourceCode,
	css:CSSSource,
	curr_css: CSSSelected
});

export default allReducers;