import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

export default function configStore(){
	const store = createStore(
		rootReducer,
		applyMiddleware(thunkMiddleware, createLogger())
	);
  return store; 
}