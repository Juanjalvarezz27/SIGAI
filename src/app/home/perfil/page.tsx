import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title"
import Image from "next/image"
import Logo from "@/assets/logo.png"
import { Settings, UserPlus, Users } from "lucide-react";
import RouteButtons from "@/components/RouteButtons";

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
    { path: "/home/trabajos", label: "Trabajos", iconName: "Warehouse" as const },
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
          <div className="bg-[#F29F6D] rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 cursor-pointer p-4">
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
              </div>
          </div>

          {/* Columna derecha */}
          <div className="grid grid-rows-2 gap-4 h-full">

            {/* Rectángulo arriba - Botones según rol */}
            <div className="bg-[#A0C4FF] rounded-2xl shadow-lg p-4">
              <div className="flex flex-col h-full justify-center space-y-3">
                
                {/* Botones para Admin y Supervisor */}
                {canSeeAddAdmin && (
                  <div className="flex items-center gap-4 p-3 bg-white/80 rounded-2xl hover:bg-white transform transition-all duration-200 hover:scale-105 cursor-pointer">
                    <div className="bg-[#001F3F] p-3 rounded-lg">
                      <UserPlus className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-[#001F3F] font-bold text-lg">Agregar Admin</h2>
                      <p className="text-[#001F3F] text-sm">Añadir nuevo administrador</p>
                    </div>
                  </div>
                )}

                {canSeeAddPersonal && (
                  <div className="flex items-center gap-4 p-3 bg-white/80 rounded-2xl hover:bg-white transform transition-all duration-200 hover:scale-105 cursor-pointer">
                    <div className="bg-[#001F3F] p-3 rounded-lg">
                      <Users className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-[#001F3F] font-bold text-lg">Agregar Personal</h2>
                      <p className="text-[#001F3F] text-sm">Añadir nuevo personal</p>
                    </div>
                  </div>
                )}

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
            
            {/* Dos cuadrados abajo*/}
            <div className="grid grid-cols-2 gap-4 h-full">
              
              <div className="bg-[#001F3F] rounded-2xl shadow-lg py-8 grid justify-center items-center transform transition-all duration-200 hover:scale-105 cursor-pointer">
                <h2 className="text-white text-center text-xl font-bold">Rol de usuario</h2>
                <p className="text-white text-center text-xl font-medium">
                  {user?.rol ? capitalizeFirstLetter(user.rol.rol) : 'Usuario'}
                </p>
              </div>

              {/* Cuadrado con cuadrado interno e icono */}
              <div className="bg-[#001F3F] rounded-2xl shadow-lg flex flex-col items-center justify-center">
                  {/* Cuadrado interno */}
                  <div className="bg-[#A0C4FF] rounded-2xl w-42 h-38 flex flex-col items-center justify-center mx-auto transform transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <h2 className="text-[#001F3F] text-center text-xl font-semibold mb-2">Editar Perfil</h2>
                      <Settings className="text-[#001F3F]" strokeWidth={1.5} size={56} />
                      <div className="mt-4 w-8 h-1 rounded-full transition-all duration-300 group-hover:w-16 bg-[#001F3F]" />
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  );
}

export default Perfil;