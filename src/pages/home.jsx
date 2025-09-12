import Header from "../components/header";
import {Routes , Route} from "react-router-dom";
import ProductPage from "./client/productPage";

export default function HomePage() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <Header />
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
        <Routes path="/*">
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
          
        </Routes>
      </div>

    </div>
  );
}
