import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "material-react-toastify";
import IMS from "./components/ims";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import "material-react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InventorySales from "./components/inventorySales";
import Dashboard from "./components/dashboard";

const Muitheme = createTheme({
  palette: {
    primary: {
      main: "#a54414",
    },
    secondary: {
      main: "#ea9714",
    },
  },
});

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={Muitheme}>
        <ToastContainer position="top-center" newestOnTop />
        <div>
          <Router>
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/db" exact element={<Dashboard />} />
              <Route path="/ims" exact element={<IMS />} />
              <Route
                path="/inventory-sales"
                exact
                element={<InventorySales />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
