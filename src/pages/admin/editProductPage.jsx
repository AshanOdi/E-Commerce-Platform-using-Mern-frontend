import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  async function editProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to update a product");
      return;
    }

    let imageUrls = location.state.images; // keep old images if none are uploaded

    if (images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    try {
      if (images.length > 0) {
        // upload new images
        const promisesArray = images.map((img) => mediaUpload(img));
        imageUrls = await Promise.all(promisesArray);
      }

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



  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Edit Product</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productId">Product ID</Label>
              <Input id="productId" disabled value={productId} onChange={(e) => setProductId(e.target.value)} />
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
            <Label htmlFor="images">Replace Images (max 5, optional)</Label>
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
            <Button onClick={editProduct}>Update Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
