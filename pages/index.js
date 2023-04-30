import Layout from "@/components/Layout";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then(response => {
      setOrders(response.data);
    })
  }, []);
  const {data: session} = useSession();
  console.log(orders);
  return <Layout>
    <div className={`flex flex-col`}>
    <div className="flex justify-between">
      <h2>
        Hello Admin, <span className="text-lg font-medium">{session?.user?.name}</span>
      </h2>
      <div onClick={() => signOut()} className="flex cursor-pointer bg-gray-800 rounded-full gap-2 p-1 items-center text-white overflow-hidden">
        <img className="h-14 w-14 rounded-full" src={session?.user?.image} alt="Profile"/>
        <span><h2>{session?.user?.name}</h2></span>
      </div>
    </div>
    <div className="text-4xl font-semibold flex flex-col items-center justify-center mt-8">
       <span className="text-6xl mt-12">Welcome Admin,  </span>
       <span className="mt-6 text-5xl">Have fun with the Products and Orders.</span>
    </div>
    <div>
      <table className="basic table-auto">
        <thead className="bg-gradient-to-r uppercase from-orange-200 to-red-300 text-xl text-white font-bold">
          <tr>
            <td>Orders</td>
            <td>Order Location</td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr key={order}>
              <td>
                {order.line_items.length > 0 && order.line_items.map(l => (
                  <>
                  <td>
                  {l.price_data?.product_data?.name}
                  </td>
                  <td>
                    {l.quantity}
                  </td>
                  <td></td>
                  </>
                ))}
              </td>
              <td>{order.city}, {order.state}, {order.country}</td>
            </tr>
          ))}
          <tr>
            <td>Total Orders</td>
            <td>{orders.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </Layout>
}
