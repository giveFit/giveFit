import Immutable from 'immutable';

const immutableState = Immutable.Map({
	fetching: false,
	data: Immutable.Map({id: null})
})

/*export const queryReducer = (state = immutableState, action) => {
	switch (action.type) {
		case "STARTING_REQUEST":
			return state.set("fetching", true);
		case "FINISHED_REQUEST":
			return state.set("fetching", false)
				.set("data",
				Immutable.fromJS(action.response.data.workouts));
		default:
			return state;
	}
}*/

export default function queryReducer(state = immutableState, action){
	switch(action.type) {
		case "STARTING_REQUEST":
			return state.set("fetching", true);
		case "FINISHED_REQUEST":
			return state.set("fetching", false)
				.set("data",
					Immutable.fromJS(action.response.data.workouts));
		default:
			return state;
	}
}