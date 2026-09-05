import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Header() {

  const navigate = useNavigate()
  const { cartItemCount } = useCart();

  return (
    <div className="w-full h-[80px] shadow-2xl flex" >
      <img src="/logo.png" alt="logo" className="w-[80px] h-[80px] object-cover top-0 left-0 m-2 cursor-pointer"
      onClick={()=>{
        navigate("/")
      }}/>
      <div className="w-[calc(100%-160px)] h-full flex justify-center items-center">
        <Link to="/" className=" text-[20px] font-boold mx-2">Home</Link>
        <Link to="/product" className=" text-[20px] font-boold mx-2">Products</Link>
        <Link to="/about" className=" text-[20px] font-boold mx-2">About</Link>
        <Link to="/contact" className=" text-[20px] font-boold mx-2">Contact</Link>
        <Link to="/my-orders" className=" text-[20px] font-boold mx-2">My Orders</Link>

      </div>
      <Link
        to="/cart"
        className="w-[80px] h-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center relative text-white transition-colors"
      >
        <FaShoppingCart size={22} />
        {cartItemCount > 0 && (
          <span className="absolute top-3 right-4 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </Link>
    </div>
  );
}
