import { useEffect, useState } from "react";
import { sampleProduct } from "../../assets/sampleData";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminProductPage() {
  const [products, setProducts] = useState(sampleProduct);

  useEffect(() => {
    const response = axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      });
  },[]);

  return (
    <div className="w-full h-full bg-red-400 max-h-full overflow-y-scroll relative">
      <table className="w-full text-center">
        <thead>
          <tr>
            <td>Product ID</td>
            <td>Name</td>
            <td>Image</td>
            <td>Labelled Price</td>
            <td>Price</td>
            <td>Stock</td>
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
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link
        to="/admin/add-product"
        className="absolute bottom-5 right-5 cursor-pointer bg-green-500 text-xl text-white font-bold py-2 px-4 rounded"
      >
        +
      </Link>
    </div>
  );
}
