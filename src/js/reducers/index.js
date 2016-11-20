import {combineReducers} from 'redux';

import CSSSource  from './reducer-css-listener';
import CSSSelected  from './reducer-css-chosen';

const allReducers = combineReducers({
	css:CSSSource,
	curr_css: CSSSelected
});

export default allReducers;