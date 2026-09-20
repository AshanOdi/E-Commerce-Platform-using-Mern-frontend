import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddProductPage() {

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState([]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const navigate = useNavigate()

async function AddProduct() {

    const token = localStorage.getItem("token");
    if(!token){
      toast.error("Please login to add a product");
      return;
    }

    if(images.length <=0){
      toast.error("Please add at least one image");
      return;
    }

    if(images.length > 5){
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    // const promisesArray = images.map(image => mediaUpload(image));
    const promisesArray = [];
    for(let i = 0; i < images.length; i++){
      promisesArray[i] = mediaUpload(images[i]);
    }
    try {
      const ImageUrls = await Promise.all(promisesArray)

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
      }).then(() => {
        toast.success("Product added successfully");
        navigate("/admin/products")

      }).catch(() => {
        toast.error("Error adding product");
      });

    } catch (error) {
      toast.error("Error uploading images");
      return;
    }





  }


  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Add Product</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productId">Product ID</Label>
              <Input id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="altNames">Alt Names (comma separated)</Label>
            <Input id="altNames" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="images">Images (max 5)</Label>
            <Input id="images" type="file" multiple onChange={(e) => setImages(e.target.files)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="labelledPrice">Labelled Price</Label>
              <Input id="labelledPrice" type="number" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/products">Back</Link>
            </Button>
            <Button onClick={AddProduct}>Add Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
