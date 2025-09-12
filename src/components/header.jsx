import { Link, useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate()

  console.log();
  return (
    <div className="w-full h-[80px] shadow-2xl flex" >
      <img src="/logo.png" alt="logo" className="w-[80px] h-[80px] object-cover top-0 left-0 m-2 cursor-pointer"
      onClick={()=>{
        navigate("/")
      }}/>
      <div className="w-[calc(100%-80px)] h-full flex justify-center items-center">
        <Link to="/" className=" text-[20px] font-boold mx-2">Home</Link>
        <Link to="/product" className=" text-[20px] font-boold mx-2">Products</Link>
        <Link to="/about" className=" text-[20px] font-boold mx-2">About</Link>
        <Link to="/contact" className=" text-[20px] font-boold mx-2">Contact</Link>
        
      </div>
      <div className="w-[80px] bg-blue-600"></div>
    </div>
  );
}
