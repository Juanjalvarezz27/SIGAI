import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/Navbar";

async function AdminPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar />

      <div>
        <h1>ADMIN</h1>
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
    </>
  );
}

export default AdminPage;