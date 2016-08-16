import { createStore } from 'redux';
import rootReducer from '../reducers/index';

export default function configStore(){
	const store = createStore(
		rootReducer
	);
  return store;
}