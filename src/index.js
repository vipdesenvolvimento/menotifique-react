import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import RoutesPrivate from "./Components/Routes/Private/Private";
import StoreProvider from "./Components/Store/Provider";
import FormProvider from "./Components/Store/FormProvider";
import { SnackbarProvider } from "notistack";

import adapterLocale from "date-fns/locale/pt-BR";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Login from "./Views/Login/Login";
import Admin from "./Layout/Admin";

ReactDOM.render(
	<React.Fragment>
		<SnackbarProvider maxSnack={3}>
			<Router>
				<StoreProvider>
					<LocalizationProvider
						sx={{ mt: 0 }}
						dateAdapter={AdapterDateFns}
						locale={adapterLocale}
					>
						<FormProvider>
							<Switch>
								<Route path="/login" component={Login}></Route>
								<RoutesPrivate
									path="/admin"
									component={Admin}
								></RoutesPrivate>
								<Redirect path="/" to="/admin"></Redirect>
							</Switch>
						</FormProvider>
					</LocalizationProvider>
				</StoreProvider>
			</Router>
		</SnackbarProvider>
	</React.Fragment>,
	document.getElementById("root")
);
