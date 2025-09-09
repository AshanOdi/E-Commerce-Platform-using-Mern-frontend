import "./App.css";
import Header from "./components/header";
import ProductCard from "./components/productCard";

function App() {
  return (
    <div className="w-full h-screen bg-red-100 flex flex-col items-center justify-center">
      <div className="relative w-[600px] h-[600px]  bg-green-500 flex flex-col items-center justify-center">
        <div className="w-[100px] h-[100px] bg-blue-600"></div>
        <div className="w-[100px] h-[100px] bg-green-600"></div>
        <div className="w-[100px] h-[100px] bg-yellow-600 absolute top-[10px] left-[10px]"></div>
        <div className="w-[100px] h-[100px] bg-purple-600"></div>
        <div className="w-[100px] h-[100px] bg-pink-600"></div>
      </div>
    </div>
  );
}

export default App;
