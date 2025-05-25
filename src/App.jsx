import { Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./index.css";
import "./css/style.css";
import { useAuth } from "./store/auth";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/auth/404";
import Karyawan from "./pages/karyawan";
import KeluargaKaryawan from "./pages/KeluargaKaryawan";
import RegisterEvent from "./pages/registerEvent";

function App() {
  const navigate = useNavigate();
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const { loginResponse } = useAuth();
  let id;
  let decoded;

  if (loginResponse) {
    const token = loginResponse;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("excelitas");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 100);
    }
  }

  id = decoded?.idUser;

  if (id) {
    return (
      <>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/keluargaKaryawan" element={<KeluargaKaryawan />} />
          <Route exact path="/registerEvent" element={<RegisterEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/registerEvent" element={<RegisterEvent />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
