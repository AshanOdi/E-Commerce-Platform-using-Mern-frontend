import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState([]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const navigate = useNavigate()

async function editProduct() {

    const token = localStorage.getItem("token");
    if(!token){
      toast.error("Please login to add a product");
      return;
    }
    
    if(images.length <=0){
      toast.error("Please add at least one image");
      return;
    }

    // const promisesArray = images.map(image => mediaUpload(image));
    const promisesArray = [];
    for(let i = 0; i < images.length; i++){
      promisesArray[i] = mediaUpload(images[i]);
    }
    try {
      const ImageUrls = await Promise.all(promisesArray)
      console.log(ImageUrls);

      const altNamesArray = altNames.split(",");

      const product = {
        productId,
        name,
        altNames: altNamesArray,
        description,
        images: ImageUrls,
        labelledPrice,
        price,
        stock,
      };

      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((res) => {
        toast.success("Product added successfully");
        console.log(res.data);
        navigate("/admin/products")

      }).catch((err) => {
        toast.error("Error adding product");
        console.log(err);
      });
      
    } catch (error) {
      toast.error("Error uploading images");
      return;
    }
    



  }


  return <div className="w-full h-full flex flex-col items-center justify-center ">
    <h1>Edit Product Page</h1>
    <input type="text" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
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


