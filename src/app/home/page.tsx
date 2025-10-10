import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title"

async function AdminPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar />
      <Title text={"Inicio"} />

      <div className="w-11-12 grid justify-center items-center text-center" >
        <div >
        
        <p className="text-sm text-gray-600">Nombre:</p>
        <p className="font-medium">
          {user?.nombre} {user?.apellido}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Email:</p>
        <p className="font-medium">{user?.email}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Rol:</p>
        <p className="font-medium capitalize">{user?.rol}</p>
        </div>
      </div>
    </>
  );
}

export default AdminPage;