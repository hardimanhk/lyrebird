import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewImage from "./pages/NewImage";
import Draw from "./pages/Draw";
import GetInspired from "./pages/GetInspired";
import Play from "./pages/Play";
import MyImages from "./pages/MyImages";
import Images from "./pages/Images";
import About from "./pages/About";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
        <AppliedRoute exact path="/" component={Home} props={childProps} />
        <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} />
        <UnauthenticatedRoute exact path="/signup" component={Signup} props={childProps} />
        <AppliedRoute path="/about" component={About} props={childProps} />
        <AuthenticatedRoute exact path="/images/new" component={NewImage} props={childProps} />
        <AppliedRoute exact path="/draw" component={Draw} props={childProps} />
        <AppliedRoute exact path="/draw/:background" component={Draw} props={childProps} />
        <AppliedRoute exact path="/get-inspired" component={GetInspired} props={childProps} />
        <AuthenticatedRoute exact path="/play" component={Play} props={childProps} />
        <AuthenticatedRoute exact path="/my-images" component={MyImages} props={childProps} />
        <AuthenticatedRoute path="/images/:id" component={Images} props={childProps} />
        <Route component={NotFound} />
  </Switch>;