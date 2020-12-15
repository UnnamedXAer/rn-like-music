import React from 'react';
import { Provider } from 'react-redux';
import Layout from './hoc/Layout';
import store from './store/store';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	return (
		<Provider store={store}>
			<Layout />
		</Provider>
	);
};

export default App;
