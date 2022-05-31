import React from "react"
// import React, { useContext, useState } from "react";
// import StoreContext from "../Components/Store/Context";
import { Switch, Route, Redirect} from 'react-router-dom'
import { Container } from "@mui/material";
// import Copyright from "../Components/Footer"
import NavMenu from '../Components/AppBar/NavMenu'

import routes from '../routes';
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Admin({ ...rest }) {

  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/admin") {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.components}
              key={key}
            />
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/dashboard" />
    </Switch>
  );

  return (
    <>
      <NavMenu />
      <Container>
        {switchRoutes}
      </Container>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </>
  );
};


