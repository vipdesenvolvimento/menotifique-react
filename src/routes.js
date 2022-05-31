/** Pages */
import DashBoard from "./Views/DashBoard/DashBoard";
import Message from "./Views/Message/Message";
import Filter from "./Views/Filter/MessageFilter";
import MessageListar from "./Views/Message/Listar"
import Profile from "./Views/Profile/Profile";
import Category from "./Views/Category/Category";


/** Icons Menu */
import DashboardIcon from "@mui/icons-material/Dashboard";
import MessageIcon from "@mui/icons-material/Message";
import FilterMessage from "@mui/icons-material/AddComment";
import PersonIcon from '@mui/icons-material/Person';
import ListMessage from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';

const dashboardRoutes = [
  {
    name: "Painel de Controle",
    icon: DashboardIcon,
    path: "/dashboard",
    components: DashBoard,
    layout: "/admin",
  },
  {
    name: "Categoria",
    icon: CategoryIcon,
    path: "/categoria",
    components: Category,
    layout: "/admin",
  },
  {
    name: "Mensagem",
    icon: MessageIcon,
    path: "/message",
    components: Message,
    layout: "/admin",
  },
  {
    name: "Listar Mensagem",
    icon: ListMessage,
    path: "/list-message",
    components: MessageListar,
    layout: "/admin",
  },
  {
    name: "Ativação",
    icon: FilterMessage,
    path: "/filter",
    components: Filter,
    layout: "/admin",
  },
  {
    name: "Perfil",
    icon: PersonIcon,
    path: "/profile",
    components: Profile,
    layout: "/admin"
  }
];

export default dashboardRoutes;
