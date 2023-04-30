import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Spinners from "./Spinners";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id, 
  title:existingTitle, 
  description:existingDescription, 
  price:existingPrice, 
  images:existingImages, 
  category: assignedCategory,
  properties: assignedProperties
}){
  const [category, setCategory] = useState(assignedCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || [])
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, [])
  async function saveProduct(e){
    e.preventDefault()
    const data = {title, description, price, images, category, properties: productProperties};
    if(_id){
        await axios.put("/api/products", {...data, _id})
    } else {
        await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if(goToProducts){
    router.push("/products")
  }

  async function uploadImages(e){
    const files = e.target?.files;
    if(files?.length > 0){
      setIsUploading(true);
      const data = new FormData();
      for(const file of files){
        data.append("file", file)
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldProducts => {
        return [...oldProducts, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images){
    setImages(images)
  }
  
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  function setProductProp(propName, value){
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    })
  }
  return (
    <form onSubmit={saveProduct}>       
    <label>Product Name</label>
    <input 
      type="text" placeholder="Product name"
      value={title}
      onChange={e => setTitle(e.target.value)} />
    <label>Price</label>
    <input 
      type="number" placeholder="Price"
      value={price}
      onChange={e => setPrice(e.target.value)} />
    <label>Category</label>
    <select value={category}
            onChange={ev => setCategory(ev.target.value)}>
      <option value="">Uncategorized</option>
        {categories.length > 0 && categories.map(c => (
          <option key={c} value={c._id}>{c.name}</option>
        ))}
    </select>
    {propertiesToFill.length  > 0 && propertiesToFill.map(p => (
      <div className="flex gap-1" key={p}>
        <div>{p.name}</div>
        <select 
          value={productProperties[p.name]}
          onChange={ev => setProductProp(p.name, ev.target.value)}>
          {p.values.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
    ))}
    <label>Photos</label>
    <div className="flex flex-wrap gap-2 items-center">
      <ReactSortable list={images} className="flex flex-wrap gap-2" setList={updateImagesOrder}>
      {!!images?.length && images.map(link => (
        <div key={link} className="h-24">
          <img src={link} alt="Album" className="rounded-md" />
        </div>
      ))}
      </ReactSortable>
      {isUploading && (
        <div className="h-24 py-1 px-2 bg-gray-300 flex items-center rounded-lg">
          <Spinners/>
        </div>
      )}
      <label className="flex flex-col items-center w-20 h-20 bg-gray-300 border rounded-md justify-center cursor-pointer">  
        <div><ArrowUpTrayIcon className="h-6 w-6" /></div>
        <div className="text-lg font-semibold">Upload</div>
        <input type="file" onChange={uploadImages} className="hidden"/>
      </label>
      {!images?.length && (
        <div>No Photos of the Product</div>
      )}
    </div>
    <label>Description</label>
    <textarea 
      placeholder="Description"
      value={description}
      onChange={e => setDescription(e.target.value)} />
    <button type="submit" 
      className="bg-blue-400 px-4 py-1 text-white rounded-lg">
      Add Product
      </button>
    </form>
  );
}