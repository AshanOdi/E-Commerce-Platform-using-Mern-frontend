import { useState } from "react";
import { sampleProduct } from "../../assets/sampleData";

export default function AdminProductPage() {
  const [products, setProducts] = useState(sampleProduct);

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
              <tr>
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
