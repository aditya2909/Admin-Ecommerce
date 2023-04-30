import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then(response => {
      setOrders(response.data);
    })
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic table-auto">
        <thead className=" bg-gradient-to-r from-orange-200 to-red-300 text-xl text-white font-bold">
          <tr>
            <td>Date</td>
            <td>Recipient</td>
            <td>Location</td>
            <td>Product</td>
            <td>Paid</td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr key={order}>
              <td>{(new Date(order.createdAt).toLocaleString())}</td>
              <td>{order.name} <br/> {order.email}</td>
              <td>{order.streetAddress} <br/> {order.city} - {order.pinCode}, {order.state}, {order.country}</td>
              <td>
                {order.line_items.map(l => (
                  <>
                    {l.price_data?.product_data?.name} x {l.quantity} <br/>
                  </>
                ))}
              </td>
              <td className={order.paid ? 'text-red-700 font-medium text-lg' : 'text-green-600 font-medium text-lg'}>
                {order.paid ? 'No' : 'Yes'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}