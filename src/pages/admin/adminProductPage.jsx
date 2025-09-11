import { useEffect, useState } from "react";
import { sampleProduct } from "../../assets/sampleData";
import axios from "axios";

export default function AdminProductPage() {
  const [products, setProducts] = useState(sampleProduct);

  useEffect(() => {
    const response = axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        console.log(res.data);
        setProducts[res.data];
      });
  });

  return (
    <div className="w-full h-full bg-red-400 max-h-full overflow-y-scroll">
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
    </div>
  );
}
