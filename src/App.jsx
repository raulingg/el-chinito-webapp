import React from 'react'
import Home from './pages/Home'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import './styles.css'

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://el-chinito.herokuapp.com/v1/graphql',
    }),
    cache: new InMemoryCache(),
  })
}

const App = () => {
  const client = createApolloClient()

  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  )
}

export default App
