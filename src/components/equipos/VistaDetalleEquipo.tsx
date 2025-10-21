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
} from "lucide-react";
import { Equipo } from "../../../types/equipos";
import { useState, useEffect } from "react";
import axios from "axios";
import BotonEditarEquipo from "./BotonEditarEquipo";
import ModalEditarEquipo from "./ModalEditarEquipo";

interface VistaDetalleEquipoProps {
  equipo: Equipo;
  onVolver: () => void;
  loading?: boolean;
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

  const handleEquipoEditado = () => {
    // Recargar la página para mostrar los cambios
    window.location.reload();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onVolver}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
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
            </div>
          </div>

          <div className="flex gap-3">
            <BotonEditarEquipo 
              onClick={() => setModalEditarAbierto(true)}
              loading={loading}
            />
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
                    <p className="font-medium">{equipo.status.estado}</p>{" "}
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
                        <strong>Memoria RAM:</strong> {equipo.especificaciones.memoriaRam}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.modulosRam && (
                    <div className="flex items-center gap-2">
                      <Monitor size={16} className="text-blue-500" />
                      <span>
                        <strong>Módulos RAM:</strong> {equipo.especificaciones.modulosRam}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.capacidadDisco && (
                    <div className="flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-500" />
                      <span>
                        <strong>Capacidad Disco:</strong>{" "}
                        {equipo.especificaciones.capacidadDisco}
                      </span>
                    </div>
                  )}
                  {equipo.especificaciones.tipoDisco && (
                    <div className="flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-500" />
                      <span>
                        <strong>Tipo Disco:</strong>{" "}
                        {equipo.especificaciones.tipoDisco}
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
                  (equipoUsuario) => (
                    <div
                      key={equipoUsuario.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
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
                            <span className="font-medium">Bien Nacional:</span>{" "}
                            {equipoUsuario.bienNacional}
                          </p>
                        )}
                        {equipoUsuario.serial && (
                          <p>
                            <span className="font-medium">Serial:</span>{" "}
                            {equipoUsuario.serial}
                          </p>
                        )}
                        {equipoUsuario.estado && (
                          <div className="flex items-center gap-2">
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
                            <span className="text-gray-600">
                              Status: {equipoUsuario.status.estado}
                            </span>{" "}
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
    </>
  );
}