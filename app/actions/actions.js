import * as types from '../constants/ActionTypes';
const startingRequest = () => {
	return {
		type: "STARTING_REQUEST"
	}
}

const finishedRequest = (response) => {
	return {
		type: "FINISHED_REQUEST",
		response: response
	}
}

export const getGraph = (payload) => {
	return dispatch => {
		dispatch(startingRequest());
		return new Promise(function(resolve, reject) {
			let request=new XMLHttpRequest();
			request.open("POST", "/graphql", true);
			request.setRequestHeader("Content-Type",
				"application/graphiql");
			request.send(payload);
			request.onreadystatechange = () => {
				if (request.readyState === 4) {
					resolve(request.responseText)
				}
			}
		}).then(response =>
			dispatch(finishedRequest(JSON.parse(response))))
	}
}
