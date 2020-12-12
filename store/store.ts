import { applyMiddleware, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducer';

const middlewares = [reduxThunk];

if (__DEV__) {
	const createFlipperDebugger = require('redux-flipper').default;
	middlewares.push(createFlipperDebugger());
}
const store = createStore(reducer, compose(applyMiddleware(...middlewares)));

console.log('typeof(HermesInternal)', typeof HermesInternal);

export default store;
