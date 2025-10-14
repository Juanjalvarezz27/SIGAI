import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import Link from "next/link";
import { 
  Warehouse, 
  Users, 
  Package, 
  UserCheck, 
  Ticket, 
  Calendar, 
  BarChart3, 
  User 
} from "lucide-react";

// Definir las rutas disponibles con iconos de Lucide (sin la ruta de inicio)
const routes = [
  {
    path: "/home/trabajos",
    label: "Trabajos",
    icon: Warehouse,
    roles: ["analista"]
  },
  {
    path: "/home/personal",
    label: "Personal",
    icon: Users,
    roles: ["admin"]
  },
  {
    path: "/home/inventarioEquipos",
    label: "Inventario de equipos",
    icon: Package,
    roles: ["admin", "supervisor", "analista"]
  },
  {
    path: "/home/solicitantes",
    label: "Solicitantes",
    icon: UserCheck,
    roles: ["supervisor"]
  },
  {
    path: "/home/tickets",
    label: "Tickets",
    icon: Ticket,
    roles: ["admin", "supervisor", "solicitante", "analista"]
  },
  {
    path: "/home/eventosExternos",
    label: "Eventos Externos",
    icon: Calendar,
    roles: ["admin", "supervisor", "solicitante"]
  },
  {
    path: "/home/estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/home/perfil",
    label: "Perfil",
    icon: User,
    roles: ["admin", "supervisor", "solicitante", "analista"]
  },
];

async function Inicio() {
  const user = await getCurrentUser();
  
  // Filtrar rutas según el rol del usuario
  const availableRoutes = routes.filter(route => 
    user?.rol && route.roles.includes(user.rol.rol)
  );

  return (
    <>
      <Navbar />
      <Title text={"Inicio"}/>

      <div className="w-11/12 mx-auto">

        {/* Grid de botones estilo bento para desktop */}
        <div className="grid grid-cols-3 gap-6 w-10/12 mx-auto mt-8">
          {availableRoutes.map((route, index) => {
            const IconComponent = route.icon;
            const colorVariant = index % 3;
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`
                  group relative p-8 rounded-2xl border-2 border-gray-100
                  bg-white shadow-lg hover:shadow-2xl transition-all duration-300
                  hover:scale-105 hover:-translate-y-1 overflow-hidden
                  ${colorVariant === 0 ? 'hover:border-[#5D8AA8]' : ''}
                  ${colorVariant === 1 ? 'hover:border-[#A0C4FF]' : ''}
                  ${colorVariant === 2 ? 'hover:border-[#E8A881]' : ''}
                `}
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Cuadro del Icono */}
                  <div className={`
                    p-4 rounded-xl transition-all duration-300 group-hover:scale-110
                    ${colorVariant === 0 ? 'bg-[#F0F8FF] group-hover:bg-[#5D8AA8]' : ''}
                    ${colorVariant === 1 ? 'bg-[#F0F8FF] group-hover:bg-[#A0C4FF]' : ''}
                    ${colorVariant === 2 ? 'bg-[#F0F8FF] group-hover:bg-[#E8A881]' : ''}
                  `}>

                  {/* Icono */}
                    <IconComponent 
                      size={32} 
                      className={`
                        transition-colors duration-300
                        ${colorVariant === 0 ? 'text-[#5D8AA8] group-hover:text-white' : ''}
                        ${colorVariant === 1 ? 'text-[#003366] group-hover:text-white' : ''}
                        ${colorVariant === 2 ? 'text-[#E8A881] group-hover:text-white' : ''}
                      `}
                    />
                  </div>
                   {/* Nombre de la ruta*/}
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
                    {route.label}
                  </h3>
                  {/* Linea de Abajo */}
                  <div className={`
                    w-8 h-1 rounded-full transition-all duration-300 group-hover:w-16
                    ${colorVariant === 0 ? 'bg-[#5D8AA8]' : ''}
                    ${colorVariant === 1 ? 'bg-[#003366]' : ''}
                    ${colorVariant === 2 ? 'bg-[#E8A881]' : ''}
                  `} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mensaje si no hay rutas disponibles */}
        {availableRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay opciones disponibles para tu rol.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Inicio;