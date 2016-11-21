import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import allReducers from './reducers';

import Layout from "./components/Layout";

require('./styles.css');

const store = createStore(allReducers);

const app = document.getElementById('app');
ReactDOM.render(
	<Provider store={store}>
		<Layout/>
	</Provider>
	, app);