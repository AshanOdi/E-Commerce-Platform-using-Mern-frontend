import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ProductThumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <ImageOff size={18} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-14 w-14 rounded-lg object-cover"
    />
  );
}

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    if(isLoading==true){
      // getProduct is paginated now (Phase 9). The admin table shows the
      // whole catalog, so ask for a large page and read the products array.
      axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product?limit=200")
      .then((res) => {
        setProducts(res.data.products);
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
    <div className="relative h-full w-full overflow-y-auto p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Products {!isLoading && `(${products.length})`}
      </h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Labelled Price</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <ProductThumb src={item.images[0]} alt={item.name} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.productId}
                </TableCell>
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="text-muted-foreground line-through">
                  ${item.labelledPrice}
                </TableCell>
                <TableCell className="font-semibold text-primary">${item.price}</TableCell>
                <TableCell>
                  <Badge variant={item.stock > 0 ? "secondary" : "destructive"}>
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => deleteProduct(item.productId)}
                      aria-label="Delete product"
                      className="text-destructive hover:opacity-70"
                    >
                      <FaTrash size={15} />
                    </button>
                    <button
                      onClick={() => navigate("/admin/edit-product", { state: item })}
                      aria-label="Edit product"
                      className="text-primary hover:opacity-70"
                    >
                      <FaEdit size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button asChild size="icon" className="fixed bottom-6 right-6 h-12 w-12 rounded-full text-xl shadow-lg">
        <Link to="/admin/add-product" aria-label="Add product">
          +
        </Link>
      </Button>
    </div>
  );
}
