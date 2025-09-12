import { useEffect, useState } from "react";
import { sampleProduct } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductPage() {
  const [products, setProducts] = useState(sampleProduct);
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    if(isLoading==true){
      const response = axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setIsLoading(false)
      });
    }
    
  },[isLoading]);

  function deleteProduct(productId){
    const token = localStorage.getItem("token")
    if(token==null){
      toast.error("Please Login First")
      return
    }

    axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/product/"+productId , {
      headers : {
        "Authorization" : "Bearer "+token
      }
    }).then(()=>{
      toast.success("Product Deleted Successfully")
      setIsLoading(true)
    }).catch((e)=>(
      toast.error(e.response.data.message)))
    
  }

  return (
    <div className="w-full h-full bg-red-400 max-h-full overflow-y-scroll relative">
      {(isLoading)?
      <div className="w-full h-full flex justify-center items-ceter">
          <div className="w-[70px] h-[70px]  border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>:
        <table className="w-full text-center">
        <thead>
          <tr>
            <td>Product ID</td>
            <td>Name</td>
            <td>Image</td>
            <td>Labelled Price</td>
            <td>Price</td>
            <td>Stock</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.productId}</td>
                <td>{item.name}</td>
                <td>
                  <img src={item.images[0]} className="w-[100px] h-[100px]" />
                </td>
                <td>{item.labelledPrice}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td> <div className="flex flex-row gap-2"><FaTrash  className="text-red-500 mx-2" cursor="pointer" onClick={()=>{
                  deleteProduct(item.productId)
                }} /> <FaEdit onClick={()=>{
                  navigate("/admin/edit-product" , {
                    state : item
                  })
                  
                }} className="text-blue-500" cursor="pointer" /></div> </td>
              </tr>
            );
          })}
        </tbody>
      </table> }
      <Link
        to="/admin/add-product"
        className="absolute bottom-5 right-5 cursor-pointer bg-green-500 text-xl text-white font-bold py-2 px-4 rounded"
      >
        +
      </Link>
    </div>
  );
}
