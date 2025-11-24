import { Package, Eye } from "lucide-react";

interface BotonVerEquiposLibresProps {
  onClick: () => void;
  loading?: boolean;
}

export default function BotonVerEquiposLibres({ 
  onClick, 
  loading = false 
}: BotonVerEquiposLibresProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex h-14 items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 cursor-pointer"
    >
      <Package size={18} />
      {loading ? "Cargando..." : "Ver Equipos Libres"}
    </button>
  );
}