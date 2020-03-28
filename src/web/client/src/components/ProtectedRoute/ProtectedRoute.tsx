import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface Props extends RouteProps {
  isLoggedIn: boolean;
  redirectPath: string;
}

export default class ProtectedRoute extends Route<Props> {
  render() {
    console.log(this.props.isLoggedIn);

    if (this.props.isLoggedIn === false) {
      return <Redirect to={{ pathname: this.props.redirectPath }} />;
    } else {
      return <Route {...this.props} />;
    }
  }
}
