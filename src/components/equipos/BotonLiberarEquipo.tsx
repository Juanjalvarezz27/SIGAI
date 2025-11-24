import { Unlock } from "lucide-react";

interface BotonLiberarEquipoProps {
  onClick: () => void;
  loading?: boolean;
}

export default function BotonLiberarEquipo({ 
  onClick, 
  loading = false 
}: BotonLiberarEquipoProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 cursor-pointer"
    >
      <Unlock size={18} />
      {loading ? "Liberando..." : "Liberar Equipo"}
    </button>
  );
}