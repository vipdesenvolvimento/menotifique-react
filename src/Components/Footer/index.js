import 
    {Typography, Link} 
from "@mui/material";

function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Todos os direitos reservados © "}
        <Link color="inherit" href="https://vipbrtelecom.com.br/">
          VIPBRTelecom
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  export default Copyright