import React from "react";
import ReactDOM from "react-dom";

import { ApolloProvider } from "react-apollo";
import graphqlClient from "./graphqlClient";

import Application from "./components/Application/Application";
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("app")
);
