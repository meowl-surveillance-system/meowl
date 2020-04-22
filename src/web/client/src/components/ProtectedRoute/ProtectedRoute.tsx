import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface Props extends RouteProps {
  isLoggedIn: boolean;
  redirectPath: string;
}

/**
 * A wrapper around the Route component that enforces route protection
 */
export default class ProtectedRoute extends Route<Props> {
  /**
   * Renders Redirect to the redirectPath prop if user is not logged in,
   * else render the intended route that the user wants to go to.
   */
  render() {
    if (this.props.isLoggedIn === false) {
      return <Redirect to={{ pathname: this.props.redirectPath }} />;
    } else {
      return <Route {...this.props} />;
    }
  }
}
