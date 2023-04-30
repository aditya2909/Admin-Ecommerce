import Layout from "@/components/Layout";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    },[])
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name, parentCategory, properties:properties.map(p => (
            {
                name: p.name,
                values: p.values.split(','),
            }
        ))};
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }
        
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name, values}) =>({
            name, values:values.join(','),
        })));
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are You Sure',
            text: `Do you want to delete ${category.name}`,
            reverseButtons: true,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            didOpen: () => {
                // run when swal is opened...
            },
            didClose: () => {
                // run when swal is closed...
            }
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        }).catch(error => {
            // when promise rejected...
        });
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'', value:''}]
        })
    }
    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValueChange(index, property, newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
            
        });
    }
    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create New Category'}</label>
            <form onSubmit={saveCategory}>   
                <div className="flex gap-1">
                <input type="text" 
                onChange={ev => setName(ev.target.value)} 
                value={name} placeholder={'Category Name'}/>
                <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                    <option value="0">No Parent Category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category} value={category._id}>{category.name}</option>
                    ))}
                </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties </label>
                    <button type="button" onClick={addProperty} className="bg-gray-300 px-4 py-1 rounded-lg text-sm mb-2">Add New Properties</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={property} className="flex gap-1 py-1">
                            <input type="text" value={property.name} 
                                onChange={ev => handlePropertyNameChange(index,property, ev.target.value)}
                                placeholder="property name (example: color)" />
                            <input type="text" value={property.values} 
                                onChange={ev => handlePropertyValueChange(index, property, ev.target.value)}
                                placeholder="value , comma seperated" />
                            <button type="button" onClick={() => removeProperty(index)} className=" bg-gray-500 rounded-md px-4 text-lg" >Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button 
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }} type="button"
                            className="bg-gray-500 rounded-md px-4 py-1">Cancel</button>
                    )}
                    <button type="submit" className="bg-blue-500 rounded-md px-4 py-1" >Save</button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic">
                <thead className="bg-gradient-to-r uppercase from-orange-200 to-red-300 text-xl text-white font-bold">
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(
                        category => (
                            <tr key={category}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td className="flex items-center justify-center gap-4">
                                    <button className="rounded-md bg-green-300 py-1 px-2 flex items-center" 
                                      onClick={() => editCategory(category)}>
                                        <PencilSquareIcon className="h-4 w-4" />Edit</button>
                                    <button className="rounded-md bg-red-300 py-1 px-2 flex items-center"
                                      onClick={() => deleteCategory(category)}
                                    >
                                        <TrashIcon className="h-4 w-4" />Delete</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            )}
            
        </Layout>
    );  
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
))