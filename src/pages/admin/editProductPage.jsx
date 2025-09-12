import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {
  const location = useLocation() //json ekak denne  
  const [productId, setProductId] = useState(location.state.productId);
  const [name, setName] = useState(location.state.name);
  const [altNames, setAltNames] = useState(location.state.altNames.join(","));
  const [description, setDescription] = useState(location.state.description);
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice);
  const [price, setPrice] = useState(location.state.price);
  const [stock, setStock] = useState(location.state.stock);
  const navigate = useNavigate()

  
  console.log(location)

  

  async function editProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to update a product");
      return;
    }
  
    let imageUrls = location.state.images; // keep old images if none are uploaded
  
    try {
      if (images.length > 0) {
        // upload new images
        const promisesArray = images.map((img) => mediaUpload(img));
        imageUrls = await Promise.all(promisesArray);
      }
  
      console.log("Final image URLs:", imageUrls);
  
      const altNamesArray = altNames.split(",");
  
      const product = {
        productId,
        name,
        altNames: altNamesArray,
        description,
        images: imageUrls,
        labelledPrice,
        price,
        stock,
      };
  
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/product/" + productId,
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
  
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error in editProduct:", error);
      toast.error("Error updating product");
    }
  }
  


  return <div className="w-full h-full flex flex-col items-center justify-center ">
    <h1>Edit Product Page</h1>
    <input type="text" disabled placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <input type="text" placeholder="Alt Names" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
    <input type="file" multiple placeholder="Images" onChange={(e) => setImages(e.target.files)} />
    <input type="number" placeholder="Labelled Price" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} />
    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
    <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
    <div className="w-full flex justify-center items-center flex-row mr-4">
      <Link to="/admin/products" className="bg-blue-500 text-white p-2 rounded-md">Back</Link>
      <button onClick={editProduct} className="bg-green-500 text-white p-2 rounded-md">Update Product</button>
    </div>

  </div>;
}


