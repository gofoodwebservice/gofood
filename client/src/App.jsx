import './App.css';
import { CartProvider } from './components/ContextReducer';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import MyOrder from './screens/Myorder';
import AdminOrder from './screens/AdminOrder';
import MyOrder2 from './screens/MyOrder-2.jsx';
import Admin from './Admin/AddItems.jsx';
import ListItems from './Admin/ListItems.jsx';
import UpdateItems from './Admin/UpdateItems.jsx';
import EmailModal from './screens/EmailModal.jsx';
import AdminLogin from './Admin/AdminLogin.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [table, setTable] = useState("");

  return (
    <CartProvider>
      <Router>
        <AppRoutes setTable={setTable} table={table} />
      </Router>
    </CartProvider>
  );
}

function AppRoutes({ setTable, table }) {
  // Extract table query and manage redirection
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tableFromURL = searchParams.get("table");
    if (tableFromURL) {
      console.log(tableFromURL)
      localStorage.setItem("table", tableFromURL);
      setTable(tableFromURL); // Save table information globally
      window.history.replaceState(null, "", "/"); // Redirect to "/"
    }
  }, [searchParams, setTable]);

  return (
    <Routes>
      {/* Home Route */}
      <Route exact path="/" element={<Home table={table} />} />

      {/* Other Routes */}
      <Route exact path='/myorders' element={<MyOrder />} />
      <Route exact path='/adminOrder' element={<AdminOrder />} />
      <Route exact path='/myOrder' element={<MyOrder2 />} />
      <Route exact path='/admin' element={<Admin />} />
      <Route exact path='/list' element={<ListItems />} />
      <Route exact path='/update' element={<UpdateItems />} />
      <Route exact path='/modal' element={<EmailModal />} />
      <Route exact path='/adminlogin' element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
