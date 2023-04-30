import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("/api/products").then(response => {
      setProducts(response.data);
    })
  }, [])
  return (
    <Layout>
            <Link className="px-2 py-1 bg-gray-600 flex mx-auto justify-center text-white rounded-md" href={"/products/new"}>Add new Product</Link>
        <div className="p-10">
            <table className="basic table-auto">
              <thead className=" bg-gradient-to-r uppercase from-orange-200 to-red-300 text-xl text-white font-bold">
                <tr>
                  <td>Product Name</td>
                  <td>Product Price</td>
                  <td>Product Description</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  // eslint-disable-next-line react/jsx-key
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td className="flex items-center text-center justify-end gap-4">
                      <div className="rounded-md bg-green-300 py-1">
                        <Link href={"/products/edit/" + product._id} className="" ><PencilSquareIcon className="h-4 w-4" />Edit</Link>
                      </div>
                      <div className="rounded-md bg-red-300 py-1">
                        <Link href={"/products/delete/" + product._id} ><TrashIcon className="h-4 w-4" />Delete</Link>
                      </div>
                      <div className="rounded-md bg-cyan-300 py-1">
                        <Link href={"/products/view/" + product._id} ><EyeIcon className="h-4 w-4" />View</Link>  
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </Layout>
  )
}