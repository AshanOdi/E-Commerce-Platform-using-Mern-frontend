import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import Header from "./components/header";
import AdminPage from "./pages/adminPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <Header /> */}
        <Routes path="/*">
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/*" element={<h1>404 not Found</h1>} />
        </Routes>
      </div>

      <div>
        {/* <div className="relative w-[600px] h-[600px]  bg-green-500 flex flex-col items-center justify-center">
        <div className="w-[100px] h-[100px] bg-blue-600"></div>
        <div className="w-[100px] h-[100px] bg-green-600"></div>
        <div className="w-[100px] h-[100px] bg-yellow-600 absolute top-[10px] left-[10px]"></div>
        <div className="w-[100px] h-[100px] bg-purple-600"></div>
        <div className="w-[100px] h-[100px] bg-pink-600"></div>
      </div> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
