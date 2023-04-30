import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function DeleteProductPage(){
    const router = useRouter();
    const {id} = router.query;
    const [productInfo, setProductInfo] = useState();

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get("/api/products?id="+id).then(response => {
            setProductInfo(response.data);
        })
    }, [id]);

    function goBack(){
        router.push("/products")
    }
    async function deleteProduct(){
        await axios.delete("/api/products?id="+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you Really want to Delete Product &quot;{productInfo?.title}&quot; ?</h1>
            <div className="flex gap-2 justify-center">
            <button className="px-2 py-1 bg-red-500 rounded-md" onClick={deleteProduct}>Yes</button>
            <button className="px-2 py-1 rounded-md bg-green-600" onClick={goBack}>No</button>
            </div>
        </Layout>
    );
}