import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split, HttpLink, ApolloClient } from '@apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import './styles.css'
import { OrderProvider } from './hooks/useOrder'
import Orders from './pages/orders'

const httpLink = new HttpLink({
  uri: 'https://el-chinito.herokuapp.com/v1/graphql',
})

const wsLink = new WebSocketLink({
  uri: `wss://el-chinito.herokuapp.com/v1/graphql`,
  options: {
    reconnect: true,
    timeout: 60000,
  },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <OrderProvider>
        <Router>
          <Switch>
            <Route component={Home} path="/" exact />
            <Route component={Orders} path="/orders" />
          </Switch>
        </Router>
      </OrderProvider>
    </ApolloProvider>
  )
}

export default App
