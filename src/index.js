import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider, Query } from "react-apollo";

//To connect Apollo Client to React,
//you will need to use the ApolloProvider component exported from react-apollo.
const client = new ApolloClient({
  uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
});

client
  .query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `
  })

  .then(result => console.log(result));

const ExchangeRates = () => (
  <Query
    query={gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>loading..</p>;
      if (error) return <p>error :( </p>;
      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>{`${currency}:${rate}`}</p>
        </div>
      ));
    }}
  </Query>
);

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My First Apollo app</h2>
    </div>
    <ExchangeRates />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
