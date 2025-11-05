"use client";

import {
  Cpu,
  User,
  Hash,
  Barcode,
  Building,
  MapPin,
  Briefcase,
  Monitor,
  HardDrive,
  ArrowLeft,
  FileText,
  Mail,
  CreditCard,
  Circle,
  CheckCircle,
  Calendar,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { Equipo } from "../../../types/equipos";
import { useState, useEffect } from "react";
import axios from "axios";
import BotonEditarEquipo from "./BotonEditarEquipo";
import ModalEditarEquipo from "./ModalEditarEquipo";
import BotonDesincorporarEquipo from "./BotonDesincorporarEquipo";
import ModalDesincorporarEquipo from "./ModalDesincorporarEquipo";

interface VistaDetalleEquipoProps {
  equipo: Equipo;
  onVolver: () => void;
  loading?: boolean;
}

interface HistorialDesincorporacion {
  id: number;
  motivo: string;
  fechaDeshabilitacion: string;
  deshabilitadoPor: {
    id: number;
    nombre: string;
    apellido: string;
  };
  statusAnterior: {
    id: number;
    estado: string;
  };
  statusNuevo: {
    id: number;
    estado: string;
  };
  estadoAnterior?: {
    id: number;
    nombre: string;
  } | null;
  estadoNuevo?: {
    id: number;
    nombre: string;
  } | null;
  equipo: {
    id: number;
    bienNacional?: string;
    serial?: string;
    tipoEquipo: {
      nombre: string;
    };
    modelo: {
      nombre: string;
      marca: {
        nombre: string;
      };
    };
  };
}

interface ReasignacionHistorial {
  id: number;
  equipoId: number;
  usuarioAnteriorId: number | null;
  usuarioNuevoId: number | null;
  motivo: string | null;
  reasignadoPorId: number;
  fechaReasignacion: string;
  usuarioAnterior?: {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string | null;
    cedula: string | null;
  } | null;
  usuarioNuevo?: {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string | null;
    cedula: string | null;
  } | null;
  reasignadoPor: {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string | null;
  };
}

// Función helper para eliminar equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    return `${equipo.modelo.nombre}-${equipo.modelo.marca.nombre}-${
      equipo.bienNacional || "sin-bien"
    }-${equipo.serial || "sin-serial"}`;
  };

  const equiposUnicos = new Map();

  equipos.forEach((equipo) => {
    const clave = crearClaveUnica(equipo);
    if (!equiposUnicos.has(clave)) {
      equiposUnicos.set(clave, equipo);
    }
  });

  return Array.from(equiposUnicos.values());
};

export default function VistaDetalleEquipo({
  equipo,
  onVolver,
  loading = false,
}: VistaDetalleEquipoProps) {
  const [equiposUsuario, setEquiposUsuario] = useState<Equipo[]>([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDesincorporarAbierto, setModalDesincorporarAbierto] = useState(false);
  const [loadingDesincorporar, setLoadingDesincorporar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [historialDesincorporacion, setHistorialDesincorporacion] = useState<HistorialDesincorporacion[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [historialReasignaciones, setHistorialReasignaciones] = useState<ReasignacionHistorial[]>([]);
  const [cargandoHistorialReasignaciones, setCargandoHistorialReasignaciones] = useState(false);

  // Verificar si el equipo está desincorporado (Status Desincorporados)
  const estaDesincorporado = equipo.status?.id === 3;

  // Cargar equipos del usuario cuando el equipo tenga usuario asignado
  useEffect(() => {
    const cargarEquiposUsuario = async () => {
      if (equipo.usuario?.id) {
        try {
          setCargandoEquipos(true);
          const response = await axios.get(
            `/api/equipos/usuario/${equipo.usuario.id}`
          );
          if (response.status === 200) {
            // Filtrar el equipo actual de la lista
            const equiposFiltrados = response.data.equipos.filter(
              (eq: Equipo) => eq.id !== equipo.id
            );
            setEquiposUsuario(equiposFiltrados);
          }
        } catch (error) {
          console.error("Error cargando equipos del usuario:", error);
          setEquiposUsuario([]);
        } finally {
          setCargandoEquipos(false);
        }
      } else {
        setEquiposUsuario([]);
      }
    };

    cargarEquiposUsuario();
  }, [equipo.usuario?.id, equipo.id]);

  // Cargar historial de desincorporación si el equipo está desincorporado
  useEffect(() => {
    const cargarHistorialDesincorporacion = async () => {
      if (estaDesincorporado) {
        try {
          setCargandoHistorial(true);
          const response = await axios.get(
            `/api/equipos/${equipo.id}/desincorporacion-historial`
          );
          if (response.status === 200) {
            setHistorialDesincorporacion(response.data.historial || []);
          }
        } catch (error) {
          console.error("Error cargando historial de desincorporación:", error);
          setHistorialDesincorporacion([]);
        } finally {
          setCargandoHistorial(false);
        }
      }
    };

    cargarHistorialDesincorporacion();
  }, [equipo.id, estaDesincorporado]);

  // Cargar historial de reasignaciones
  useEffect(() => {
    const cargarHistorialReasignaciones = async () => {
      try {
        setCargandoHistorialReasignaciones(true);
        const response = await axios.get(
          `/api/equipos/${equipo.id}/reasignacion-historial`
        );
        if (response.status === 200) {
          setHistorialReasignaciones(response.data.historial || []);
        }
      } catch (error) {
        console.error("Error cargando historial de reasignaciones:", error);
        setHistorialReasignaciones([]);
      } finally {
        setCargandoHistorialReasignaciones(false);
      }
    };

    cargarHistorialReasignaciones();
  }, [equipo.id]);

  // Efecto para limpiar el mensaje de éxito después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleEquipoEditado = () => {
    // Recargar la página para mostrar los cambios
    window.location.reload();
  };

  const handleDesincorporarEquipo = async (motivo: string) => {
    try {
      setLoadingDesincorporar(true);

      const response = await axios.post(`/api/equipos/${equipo.id}/desincorporar`, {
        motivo
      });

      if (response.status === 200) {
        // Mostrar mensaje de éxito y cerrar modal
        setSuccessMessage("Desincorporación realizada con éxito");
        setModalDesincorporarAbierto(false);
        setLoadingDesincorporar(false);
      }
    } catch (error: unknown) {
      console.error('Error desincorporando equipo:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Error al desincorporar el equipo');
      } else {
        alert('Error al desincorporar el equipo');
      }
      setLoadingDesincorporar(false);
    }
  };

  const handleHabilitarEquipo = async () => {
    try {
      setLoadingDesincorporar(true);

      const response = await axios.post(`/api/equipos/${equipo.id}/incorporar`);

      if (response.status === 200) {
        // Mostrar mensaje de éxito para incorporación
        setSuccessMessage("Incorporación realizada con éxito");
        setLoadingDesincorporar(false);
      }
    } catch (error: unknown) {
      console.error('Error habilitando equipo:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Error al habilitar el equipo');
      } else {
        alert('Error al habilitar el equipo');
      }
      setLoadingDesincorporar(false);
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Mensaje de éxito global */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg max-w-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">{successMessage}</p>
              <p className="text-sm text-green-700 mt-1">
                La página se actualizará automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onVolver}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {equipo.tipoEquipo.nombre}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">
                {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
              </p>
              {equipo.estado && (
                <div className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      equipo.estado.id === 1
                        ? "bg-green-500" // En uso - Verde
                        : equipo.estado.id === 2
                        ? "bg-yellow-500" // Sin uso - Amarillo
                        : "bg-gray-500" // Otros estados - Gris
                    }`}
                  />
                  <span className="text-sm text-gray-500">
                    {equipo.estado.nombre}
                  </span>
                </div>
              )}
              {estaDesincorporado && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  Desincorporado
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <BotonEditarEquipo
              onClick={() => setModalEditarAbierto(true)}
              loading={loading}
            />

            {/* Botón de desincorporar/habilitar */}
            {!estaDesincorporado ? (
              <BotonDesincorporarEquipo
                onClick={() => setModalDesincorporarAbierto(true)}
                loading={loading || loadingDesincorporar}
              />
            ) : (
              <button
                onClick={handleHabilitarEquipo}
                disabled={loading || loadingDesincorporar}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loadingDesincorporar ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Incorporando...
                  </>
                ) : (
                  'Incorporar Equipo'
                )}
              </button>
            )}

            <button
              onClick={onVolver}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transform transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Volver a la lista
            </button>
          </div>
        </div>

        {/* Información del Equipo y Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Información del Equipo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Cpu size={20} className="text-blue-600" />
              Información del Equipo
            </h3>
            <div className="space-y-3">
              {equipo.bienNacional && (
                <div className="flex items-center gap-3">
                  <Hash size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bien Nacional</p>
                    <p className="font-medium">{equipo.bienNacional}</p>
                  </div>
                </div>
              )}

              {equipo.serial && (
                <div className="flex items-center gap-3">
                  <Barcode size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Serial</p>
                    <p className="font-medium">{equipo.serial}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Cpu size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">{equipo.tipoEquipo.nombre}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Modelo</p>
                  <p className="font-medium">
                    {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                  </p>
                </div>
              </div>

              {/* Estado - Mostrar el Estado (En uso/Sin uso) */}
              {equipo.estado ? (
                <div className="flex items-center gap-3">
                  <Circle
                    size={20}
                    className={`${
                      equipo.estado.id === 1
                        ? "text-green-500 fill-green-500" // En uso - Verde
                        : equipo.estado.id === 2
                        ? "text-yellow-500 fill-yellow-500" // Sin uso - Amarillo
                        : "text-gray-500 fill-gray-500" // Otros estados - Gris
                    }`}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium">{equipo.estado.nombre}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Circle size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium text-gray-400">No asignado</p>
                  </div>
                </div>
              )}

              {/* Status - Mostrar el Status (Operativos/Inoperativos/Desincorporados) */}
              {equipo.status ? (
                <div className="flex items-center gap-3">
                  <Circle
                    size={20}
                    className={`${
                      equipo.status.estado === "Operativos"
                        ? "text-green-500 fill-green-500"
                        : equipo.status.estado === "Inoperativos"
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500 fill-gray-500" // Para Desincorporados
                    }`}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{equipo.status.estado}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Circle size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-400">No asignado</p>
                  </div>
                </div>
              )}

              {equipo.observaciones && (
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Observaciones</p>
                    <p className="font-medium">{equipo.observaciones}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Especificaciones Técnicas */}
            {equipo.especificaciones && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Especificaciones Técnicas
                </h4>
                <div className="space-y-2 text-sm">
                  {equipo.especificaciones.procesador && (
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-blue-500" />
                      <span>
                        <strong>Procesador:</strong>{" "}
                        {equipo.especificaciones.procesador}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.memoriaRam && (
                    <div className="flex items-center gap-2">
                      <Monitor size={16} className="text-blue-500" />
                      <span>
                        <strong>RAM:</strong> {equipo.especificaciones.memoriaRam}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.capacidadDisco && (
                    <div className="flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-500" />
                      <span>
                        <strong>Almacenamiento:</strong>{" "}
                        {equipo.especificaciones.capacidadDisco}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.tipoDisco && (
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-blue-500" />
                      <span>
                        <strong>Tipo Disco:</strong>{" "}
                        {equipo.especificaciones.tipoDisco}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.modulosRam && (
                    <div className="flex items-center gap-2">
                      <Monitor size={16} className="text-blue-500" />
                      <span>
                        <strong>Módulos RAM:</strong>{" "}
                        {equipo.especificaciones.modulosRam}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Información del Usuario Asignado */}
          {equipo.usuario ? (
            <div className="bg-[#A0C4FF]/[0.3] border border-[#A0C4FF]/[0.9] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#001f3f] mb-4 flex items-center gap-2">
                <User size={20} className="text-[#001f3f]" />
                {equipo.usuario.nombre} {equipo.usuario.apellido}
              </h3>
              <div className="space-y-3">

                {equipo.usuario.cedula && (
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-[#001f3f]" />
                    <div>
                      <p className="text-sm text-gray-600">Cédula</p>
                      <p className="font-medium">{equipo.usuario.cedula}</p>
                    </div>
                  </div>
                )}

                {equipo.usuario.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-[#001f3f]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{equipo.usuario.email}</p>
                    </div>
                  </div>
                )}

                {/* Ubicación del Usuario */}
                <div className="mt-3 pt-3 border-t border-[#A0C4FF]">
                  <h4 className="font-semibold text-[#001f3f] mb-2">
                    Ubicación
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Building size={16} className="text-[#001f3f]" />
                      <div>
                        <p className="text-sm text-gray-600">Piso</p>
                        <p className="font-medium">
                          {equipo.usuario.direccion.piso.piso}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-[#001f3f]" />
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-medium">
                          {equipo.usuario.direccion.direccion}
                        </p>
                      </div>
                    </div>
                    {equipo.usuario.area && (
                      <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-[#001f3f]" />
                        <div>
                          <p className="text-sm text-gray-600">Área</p>
                          <p className="font-medium">
                            {equipo.usuario.area.nombre}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User size={20} className="text-gray-500" />
                Usuario Asignado
              </h3>
              <p className="text-gray-600">
                Este equipo no tiene usuario asignado
              </p>
            </div>
          )}
        </div>

        {/* Historial de Reasignaciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-600" />
            Historial de Reasignaciones
          </h3>

          {cargandoHistorialReasignaciones ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : historialReasignaciones.length > 0 ? (
            <div className="space-y-4">
              {historialReasignaciones.map((reasignacion, index) => (
                <div
                  key={reasignacion.id}
                  className="bg-white border border-blue-100 rounded-lg p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Reasignación</p>
                        <p className="font-medium">{formatearFecha(reasignacion.fechaReasignacion)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserIcon size={16} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Reasignado por</p>
                        <p className="font-medium">
                          {reasignacion.reasignadoPor.nombre} {reasignacion.reasignadoPor.apellido}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Usuario Anterior</p>
                        <p className="font-medium">
                          {reasignacion.usuarioAnterior 
                            ? `${reasignacion.usuarioAnterior.nombre} ${reasignacion.usuarioAnterior.apellido}`
                            : 'Sin usuario asignado'
                          }
                        </p>
                        {reasignacion.usuarioAnterior && (
                          <p className="text-xs text-gray-500">{reasignacion.usuarioAnterior.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User size={16} className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Usuario Nuevo</p>
                        <p className="font-medium">
                          {reasignacion.usuarioNuevo 
                            ? `${reasignacion.usuarioNuevo.nombre} ${reasignacion.usuarioNuevo.apellido}`
                            : 'Sin usuario asignado'
                          }
                        </p>
                        {reasignacion.usuarioNuevo && (
                          <p className="text-xs text-gray-500">{reasignacion.usuarioNuevo.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {reasignacion.motivo && (
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <p className="text-sm text-gray-600 mb-2">Motivo de Reasignación</p>
                      <p className="text-gray-800 bg-blue-50 p-3 rounded-md border border-blue-100">
                        {reasignacion.motivo}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No se encontró historial de reasignaciones para este equipo.
            </p>
          )}
        </div>

        {/* Historial de Desincorporación (solo para equipos desincorporados) */}
        {estaDesincorporado && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <RefreshCw size={20} className="text-red-600" />
              Historial de Desincorporación
            </h3>

            {cargandoHistorial ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : historialDesincorporacion.length > 0 ? (
              <div className="space-y-4">
                {historialDesincorporacion.map((registro, index) => (
                  <div
                    key={registro.id}
                    className="bg-white border border-red-100 rounded-lg p-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Desincorporación</p>
                          <p className="font-medium">{formatearFecha(registro.fechaDeshabilitacion)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <UserIcon size={16} className="text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Desincorporado por</p>
                          <p className="font-medium">
                            {registro.deshabilitadoPor.nombre} {registro.deshabilitadoPor.apellido}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <Circle size={16} className="text-yellow-500 fill-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-600">Status Anterior</p>
                          <p className="font-medium">{registro.statusAnterior.estado}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Circle size={16} className="text-red-500 fill-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Status Nuevo</p>
                          <p className="font-medium">{registro.statusNuevo.estado}</p>
                        </div>
                      </div>
                    </div>

                    {/* Nueva sección para mostrar los estados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <Circle size={16} className="text-blue-500 fill-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Estado Anterior</p>
                          <p className="font-medium">
                            {registro.estadoAnterior?.nombre || 'No especificado'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Circle size={16} className="text-green-500 fill-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Estado Nuevo</p>
                          <p className="font-medium">
                            {registro.estadoNuevo?.nombre || 'Sin uso'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-red-100">
                      <p className="text-sm text-gray-600 mb-2">Motivo de Desincorporación</p>
                      <p className="text-gray-800 bg-red-50 p-3 rounded-md border border-red-100">
                        {registro.motivo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No se encontró historial de desincorporación para este equipo.
              </p>
            )}
          </div>
        )}

        {/* Otros Equipos del Usuario */}
        {equipo.usuario && (
          <div className="bg-[#F29F6D]/[0.4] border border-[#F29F6D] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              Otros Equipos de {equipo.usuario.nombre} {equipo.usuario.apellido}
            </h3>

            {cargandoEquipos ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#F29F6D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : equiposUsuario.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {eliminarEquiposDuplicados(equiposUsuario).map(
                  (equipoUsuario, index) => (
                    <div
                      key={equipoUsuario.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor size={20} className="text-[#F29F6D]" />
                        <div>
                          <h4 className="font-semibold">
                            {equipoUsuario.tipoEquipo.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {equipoUsuario.modelo.marca.nombre}{" "}
                            {equipoUsuario.modelo.nombre}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {equipoUsuario.bienNacional && (
                          <p>
                            <span className="font-semibold">Bien Nacional:</span>{" "}
                            {equipoUsuario.bienNacional}
                          </p>
                        )}
                        {equipoUsuario.serial && (
                          <p>
                            <span className="font-semibold">Serial:</span>{" "}
                            {equipoUsuario.serial}
                          </p>
                        )}
                        {equipoUsuario.estado && (
                          <div className="flex items-center gap-2 font-semibold">
                            <Circle
                              size={12}
                              className={`${
                                equipoUsuario.estado.id === 1
                                  ? "text-green-500 fill-green-500"
                                  : equipoUsuario.estado.id === 2
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-500 fill-gray-500"
                              }`}
                            />
                            <span className="text-gray-600">
                              {equipoUsuario.estado.nombre}
                            </span>
                          </div>
                        )}
                        {equipoUsuario.status && (
                          <div className="flex items-center gap-2">
                            <Circle
                              size={12}
                              className={`${
                                equipoUsuario.status.estado === "Operativos"
                                  ? "text-green-500 fill-green-500"
                                  : equipoUsuario.status.estado ===
                                    "Inoperativos"
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-500 fill-gray-500"
                              }`}
                            />
                            <span className="text-gray-600 font-semibold">
                              Status: {equipoUsuario.status.estado}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600">
                No hay otros equipos asignados a este usuario
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      <ModalEditarEquipo
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onEquipoEditado={handleEquipoEditado}
        equipo={equipo}
      />

      {/* Modal de Desincorporación */}
      <ModalDesincorporarEquipo
        isOpen={modalDesincorporarAbierto}
        onClose={() => setModalDesincorporarAbierto(false)}
        onConfirm={handleDesincorporarEquipo}
        equipoNombre={`${equipo.tipoEquipo.nombre} - ${equipo.modelo.marca.nombre} ${equipo.modelo.nombre}`}
        loading={loadingDesincorporar}
      />
    </>
  );
}