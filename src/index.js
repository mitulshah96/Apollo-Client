import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider, Query } from "react-apollo";

//To connect Apollo Client to React,
//you will need to use the ApolloProvider component exported from react-apollo.

/*1 When the Query component mounts, Apollo Client creates an observable for our query.
 Our component subscribes to the result of the query via the Apollo Client cache.
2 First, we try to load the query result from the Apollo cache. 
If it’s not in there, we send the request to the server.
3 Once the data comes back, we normalize it and store it in the Apollo cache. 
Since the Query component subscribes to the result, it updates with the data reactively.
*/

const client = new ApolloClient({
  uri: "https://nx9zvp49q7.lp.gql.zone/graphql"
});

const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

const Dogs = ({ onDogSelected }) => (
  <Query query={GET_DOGS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading..";
      if (error) return `Error! ${error.message}`;
      return (
        <select name="dog" onChange={onDogSelected}>
          {data.dogs.map(dog => (
            <option key={dog.id} value={dog.breed}>
              {dog.breed}
            </option>
          ))}
        </select>
      );
    }}
  </Query>
);

const GET_DOG_PHOTO = gql`
  query dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;

const DogPhoto = ({ breed }) => (
  // The prop variables is an object containing the variables we want to pass to our GraphQL query
  <Query
    query={GET_DOG_PHOTO}
    variables={{ breed }}
    //Indicates  refreshing is taking place.
    notifyOnNetworkStatusChange
    // pollInterval={500}
    //Polling can help us achieve near real-time data by causing the query to refetch on a specified interval.
  >
    {({ loading, error, data, refetch, networkStatus }) => {
      if (networkStatus === 4) return "Refetching!";
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <div>
          <img
            src={data.dog.displayImage}
            alt="Dogs"
            style={{ height: 100, width: 100 }}
          />
          <button onClick={() => refetch()}>Refetch!</button>
        </div>
      );
    }}
  </Query>
);

class App extends React.Component {
  state = {
    selectedDog: null
  };

  onDogSelected = ({ target }) => {
    this.setState(() => ({ selectedDog: target.value }));
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <h2>Building Query components 🚀</h2>
          {this.state.selectedDog && (
            <DogPhoto breed={this.state.selectedDog} />
          )}
          <Dogs onDogSelected={this.onDogSelected} />
        </div>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
