import { useEffect,useState } from "react";
import Sidebar from "../components/admin/Sidebar";

export default function AdminAppointments(){

 const [appointments,setAppointments] = useState([]);

 useEffect(()=>{

 fetch("http://localhost:8000/api/admin/appointments",{
  headers:{
   Authorization:"Bearer "+localStorage.getItem("admin_token")
  }
 })
 .then(res=>res.json())
 .then(data=>setAppointments(data))

 },[])

 return(

  <div className="flex">

  <Sidebar/>

  <div className="ml-64 p-10 w-full">

   <h1 className="text-2xl mb-6">Appointments</h1>

   <table className="w-full border">

   <thead>
    <tr>
      <th>Pet</th>
      <th>Owner</th>
      <th>Status</th>
    </tr>
   </thead>

   <tbody>

   {appointments.map(a=>(
    <tr key={a.id}>
      <td>{a.pet_name}</td>
      <td>{a.owner_name}</td>
      <td>{a.status}</td>
    </tr>
   ))}

   </tbody>

   </table>

  </div>

  </div>

 )

}