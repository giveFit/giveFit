import React from 'react';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo';

//local
import SetupMuiTheme from './muiSetup';

//proxy apollo client to graphql server
const client = new ApolloClient({
    networkInterface: createNetworkInterface('/graphql', {
        credentials: 'same-origin',
    }),
    shouldBatch: false
})

const Application = () => {
	<ApolloProvider client={client}>
	  	<SetupMuiTheme />
	</ApolloProvider>	
}

export default Application;