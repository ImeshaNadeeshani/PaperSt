import { BrowserRouter } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles.css";
import "./home.css";
import "./shopping.css";
import "./purchase.css";
import "./professional.css";
export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );
}
