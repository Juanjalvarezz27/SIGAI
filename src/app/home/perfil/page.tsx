import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title"
import Image from "next/image"
import Logo from "@/assets/logo.png"
import RouteButtons from "@/components/RouteButtons";
import EditProfileButton from "@/components/editarPerfil/EditProfileButton";
import AddAdminButton from "@/components/agregarAdmin/AddAdminButton";
import AddPersonalButton from "@/components/agregarPersonal/AddPersonalButton";
import VerMisEquiposButton from "@/components/perfil/VerMisEquiposButton";

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function Perfil () {
  const user = await getCurrentUser();

  // Determinar qué botones mostrar basado en el rol del usuario
  const canSeeAddAdmin = user?.rol?.rol === 'admin';
  const canSeeAddPersonal = user?.rol?.rol === 'admin' || user?.rol?.rol === 'supervisor';
  const isAnalista = user?.rol?.rol === 'analista';
  const isSolicitante = user?.rol?.rol === 'solicitante';

  // Rutas disponibles para analista - usando nombres de iconos
  const analistaRoutes = [
    { path: "/home/inventarioEquipos", label: "Inventario", iconName: "Package" as const },
    { path: "/home/tickets", label: "Tickets", iconName: "Ticket" as const }
  ];

  // Rutas disponibles para solicitante - usando nombres de iconos
  const solicitanteRoutes = [
    { path: "/home/tickets", label: "Tickets", iconName: "Ticket" as const },
    { path: "/home/eventosExternos", label: "Eventos", iconName: "Calendar" as const }
  ];

  return (
    <>
      <Navbar />
      <Title text={"Perfil"} />

      <h1 className="font-semibold text-3xl mx-auto text-center">
        Bienvenido, {user?.nombre} {user?.apellido}
      </h1>

      <div className="w-11/12 mx-auto mt-8">
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto h-96">

          {/* Cuadrado naranja grande a la izquierda */}
          <div className="bg-[#F29F6D] rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 p-4">
            <Image
              src={Logo}
              alt="Logo del INHRR"
              className="w-32 flex mx-auto"
            />
            <h2 className="text-center text-white font-semibold text-xl ">Instituto Nacional de Higiene <br/> <span>«Rafael Rangel»</span></h2>

            <div className="w-11/12 mx-auto mt-4 bg-[#D96521]/40 rounded-2xl p-6 text-center text-white">
              <p className="font-medium text-md mb-4">
                {user?.direccion?.direccion}
              </p>
              <p className="text-md">
                {user?.direccion?.piso?.piso}
                {user?.area && ` | ${user.area.nombre}`}
              </p>
              <p className="text-white mt-4 text-center text-md font-medium">
                Rol: <strong>{user?.rol ? capitalizeFirstLetter(user.rol.rol) : 'Usuario'}</strong>
              </p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="grid grid-rows-2 gap-4 h-full">

            {/* Rectángulo arriba - Botones según rol */}
            <div className="bg-[#A0C4FF] rounded-2xl shadow-lg p-4">
              <div className="flex flex-col h-42 justify-center space-y-3">

                {/* Botones para Admin y Supervisor */}
                {canSeeAddAdmin && <AddAdminButton />}
                {canSeeAddPersonal && <AddPersonalButton />}

                {/* Botones para Analista */}
                {isAnalista && (
                  <RouteButtons routes={analistaRoutes} />
                )}

                {/* Botones para Solicitante */}
                {isSolicitante && (
                  <RouteButtons routes={solicitanteRoutes} />
                )}

              </div>
            </div>

            {/* Dos cuadrados abajo */}
            <div className="grid grid-cols-2 gap-4 h-full">

              {/* Cuadrado con el rol */}
              <div className="bg-[#001F3F] rounded-2xl shadow-lg py-8 grid justify-center items-center ">
                <VerMisEquiposButton userId={user?.id} />
              </div>

              {/* Cuadrado con los botones de editar perfil y ver equipos */}
              <div className="bg-[#001F3F] rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4 p-4">
                <EditProfileButton />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Perfil;