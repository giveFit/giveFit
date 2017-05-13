import React from 'react'
import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'
import apolloConfig from '../../../../apolloConfig'
import LoggedInToolbar from '../Header/LoggedInToolbar'
import MainToolbar from '../../Home/Header/MainToolbar'

function graphQLFetcher (graphQLParams) {
  return fetch(apolloConfig.api, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.scaphold_user_token ? 'Bearer ' + localStorage.scaphold_user_token : '',
    },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json())
}

class GraphiQLModule extends React.Component {
  render () {
    var header
    if (!localStorage.token) {
      header = <MainToolbar />
    } else {
      header = <LoggedInToolbar />
    }

    return (
      <span>
        {header}
        <GraphiQL fetcher={graphQLFetcher} />
      </span>
    )
  }
}

export default GraphiQLModule
