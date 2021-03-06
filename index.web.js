import 'babel-polyfill';
import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage } from 'react-native';
import { AppContainer } from 'react-hot-loader';
import app from './example/travel';
import configureStore from './example/travel/store';
import * as appActions from './example/travel/store/action/app';

const store = configureStore();
const render = (AppComponent) => {
	const rootEl = document.getElementById('root');

	ReactNative.render(
		<AppContainer>
			<AppComponent store={store}/>
		</AppContainer>,
		rootEl
	);
};

render(app);

if (module.hot) {
	module.hot.accept('./example/travel', () => {
		const nextApp = require('./example/travel').default; //eslint-disable-line
		render(nextApp);

		/* Beautiful workaround:
		 Force update unrelated modules in the next execution loop.*/
		setTimeout(() => store.dispatch(appActions.increaseCounter()), 0);
	});
}