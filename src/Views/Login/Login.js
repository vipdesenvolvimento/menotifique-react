import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useHistory } from "react-router-dom";
import StoreContext from "../../Components/Store/Context";
import FlashMessage from "../../Components/Flash/FlashMessage";

import Copyright from "../../Components/Footer"

import axios from "axios";

function initialState() {
  return { username: "", password: "" };
}

function initialError() {
  return { message: "", type: "warning" };
}

// function later(delay) {
//   return new Promise(function(resolve) {
//       setTimeout(resolve, delay);
//   });
// }

const Login = () => {
  const [error, setError] = useState(initialError);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(StoreContext);
  const history = useHistory();

  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (error.message) {
        setError(initialError);
        setLoading(false);
      }
    }, 50000);
  }, [error]);

  useEffect(()=>{

    if(data !== null){
      if(data.data.auth) {
  
        setError({
           message: "Login realizado com sucesso",
           type: "success",
         });
  
         setTimeout(() => {
           setToken(data.data.id);
           setLoading(false);
  
           return history.push("/admin");
         }, 3200);
  
     } else {
  
       setError({
         message: "Usuario ou senha invalida",
         type: "error",
       });
       
     }      
    }
  
  },[data, history, setToken]);

 const sigIn = async ({ username, password }) => {
    try {

      setLoading(true);

      const options = {
        method: "POST",
        url: "http://localhost:8000/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: username,
          password: password
        }
      }

      const response = await axios.request(options);

      setData(response);

      setLoading(false);

    } catch (err) {
      setError({
        message:
          "Não foi possivel se conectar com o servidor, tente mais tarde",
        type: "error",
      });

      setLoading(false);
    }
  }

  function onChange(event) {
    const { value, name } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  function onSubmit(event) {
    event.preventDefault();

    if (!values.username || !values.password) {
      setError({
        message: "Preencha todos parametros.. porfavor",
        type: "warning",
      });

      setValues(initialState)

      setLoading(false);
      return null;
    }
    
    sigIn(values);

    setLoading(false);
  
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={
            "https://www.vipbrtelecom.com.br/_next/static/images/logo-9b15102ecdc39560f2d3371b1c9ec1b3.svg"
          }
          alt={"Vipbrtelecom"}
          style={{ maxWidth: "180px", width: "100%" }}
          arial-label="logo "
        />
        <Typography component="h1" variant="h5">
          Acesso
        </Typography>

        {error.message && (
          <FlashMessage type={error.type}>{error.message}</FlashMessage>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            label="Usuario"
            name="username"
            id="username"
            fullWidth
            autoFocus
            value={values.username}
            onChange={onChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            autoFocus
            label="Senha"
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={onChange}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loadingIndicator="Loading..."
            loading={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </LoadingButton>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default Login;
