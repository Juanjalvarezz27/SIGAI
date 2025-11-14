'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Cpu, CheckCircle, Info } from 'lucide-react';
import SeleccionEquipos from './SeleccionEquipos';
//import ModalMasInfo from './ModalMasInfo'; 
import { EquipoSeleccionado, UsuarioCompleto } from '../../../types/eventos';

interface ModalNuevoEventoProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

interface FormData {
  nombre: string;
  descripcion: string;
  fechaInicial: string;
  fechaFinal: string;
}

export default function ModalNuevoEvento({ isOpen, onClose, onEventCreated }: ModalNuevoEventoProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalEquipos, setShowModalEquipos] = useState<boolean>(false);
  const [showModalInfo, setShowModalInfo] = useState<boolean>(false); // Estado para el modal de info
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<EquipoSeleccionado[]>([]);
  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioCompleto | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    fechaInicial: '',
    fechaFinal: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Obtener información completa del usuario
  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      if (!session) return;
      
      setIsLoadingUser(true);
      try {
        const response = await fetch('/api/usuario/datos-completos');
        if (response.ok) {
          const userData: UsuarioCompleto = await response.json();
          setUsuarioInfo(userData);
        } else {
          console.error('Error obteniendo datos del usuario');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen, session]);

  // Efecto para el mensaje de éxito y scroll automático
  useEffect(() => {
    if (showSuccess && modalRef.current) {
      // Hacer scroll al principio del modal
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
        onClose();
        onEventCreated();
        // Reset form
        setFormData({ nombre: '', descripcion: '', fechaInicial: '', fechaFinal: '' });
        setEquiposSeleccionados([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose, onEventCreated]);

  // Función para obtener la fecha mínima (hoy)
  const getMinDate = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Función para validar fechas
  const validarFechas = (fechaInicial: string, fechaFinal: string): string | null => {
    if (!fechaInicial || !fechaFinal) return null;

    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    
    const fechaInicialDate = new Date(fechaInicial);
    const fechaFinalDate = new Date(fechaFinal);

    if (fechaInicialDate < ahora) {
      return 'La fecha inicial no puede ser anterior a la fecha actual';
    }

    if (fechaFinalDate < ahora) {
      return 'La fecha final no puede ser anterior a la fecha actual';
    }

    if (fechaInicialDate > fechaFinalDate) {
      return 'La fecha final debe ser posterior o igual a la fecha inicial';
    }

    return null;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      alert('El nombre del evento es requerido');
      return;
    }

    if (!formData.fechaInicial || !formData.fechaFinal) {
      alert('Las fechas inicial y final son requeridas');
      return;
    }

    // Validar fechas
    const errorFecha = validarFechas(formData.fechaInicial, formData.fechaFinal);
    if (errorFecha) {
      alert(errorFecha);
      return;
    }

    if (equiposSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un equipo');
      return;
    }

    setIsLoading(true);

    try {
      // Convertir fechas a formato completo para el backend
      const fechaInicialCompleta = `${formData.fechaInicial}T00:00:00`;
      const fechaFinalCompleta = `${formData.fechaFinal}T23:59:59`;

      const response = await fetch('/api/eventos-externos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fechaInicial: fechaInicialCompleta,
          fechaFinal: fechaFinalCompleta,
          equipos: equiposSeleccionados
        }),
      });

      if (response.ok) {
        const eventoCreado = await response.json();
        setSuccessMessage(`Evento "${eventoCreado.nombre}" creado exitosamente`);
        setShowSuccess(true);
      } else {
        const errorData: { error?: string } = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo crear el evento'}`);
      }
    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEquiposSeleccionados = (equipos: EquipoSeleccionado[]): void => {
    setEquiposSeleccionados(equipos);
  };

  const totalEquipos: number = equiposSeleccionados.reduce((sum: number, equipo: EquipoSeleccionado) => sum + equipo.cantidad, 0);

  const handleClose = (): void => {
    setFormData({ nombre: '', descripcion: '', fechaInicial: '', fechaFinal: '' });
    setEquiposSeleccionados([]);
    setShowSuccess(false);
    setSuccessMessage('');
    onClose();
  };

  const handleFechaChange = (campo: 'fechaInicial' | 'fechaFinal', valor: string): void => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-xl font-bold mb-4">Nuevo Evento Externo</h2>
          
          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
              <CheckCircle className="text-green-600" size={30} />
              <div>
                <p className="text-green-800 font-medium">¡Evento creado exitosamente!</p>
                <p className="text-green-600 text-sm">{successMessage}</p>
                <p className="text-green-500 text-xs mt-1">El modal se cerrará automáticamente...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información del usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700">Solicitado por</label>
                {isLoadingUser ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Cargando información...</p>
                  </div>
                ) : usuarioInfo ? (
                  <>
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {usuarioInfo.nombre} {usuarioInfo.apellido || ''}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {usuarioInfo.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Rol: {usuarioInfo.rol}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-red-500">Error cargando información</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                {isLoadingUser ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Cargando...</p>
                  </div>
                ) : usuarioInfo ? (
                  <>
                    <p className="mt-1 text-sm text-gray-900">
                      {usuarioInfo.direccion}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      Piso: {usuarioInfo.piso}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Área: {usuarioInfo.area}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-red-500">Error cargando ubicación</p>
                )}
              </div>
            </div>

            {/* Campos del formulario */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Evento *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese el nombre del evento"
                disabled={showSuccess}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha Inicial *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaInicial}
                  min={getMinDate()}
                  onChange={(e) => handleFechaChange('fechaInicial', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={showSuccess}
                />
                <p className="text-xs text-gray-500 mt-1">No puede ser anterior a la fecha actual</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha Final *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaFinal}
                  min={formData.fechaInicial || getMinDate()}
                  onChange={(e) => handleFechaChange('fechaFinal', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={showSuccess}
                />
                <p className="text-xs text-gray-500 mt-1">Debe ser posterior o igual a la fecha inicial</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción (Opcional)
                </label>
                {/* Botón Más Info */}
               {/* <button
                  type="button"
                  onClick={() => setShowModalInfo(true)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Info size={14} />
                  Más info
                </button> */}
              </div>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción detallada del evento..."
                disabled={showSuccess}
              />
            </div>

            {/* Selección de equipos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipos Requeridos *
                </label>
                <span className="text-sm text-gray-500">
                  {totalEquipos} equipo(s) seleccionado(s)
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setShowModalEquipos(true)}
                disabled={showSuccess}
                className="w-full border-2 border-dashed border-gray-300 rounded-md px-3 py-4 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Cpu size={16} className="mr-2" />
                <span>Seleccionar Equipos</span>
              </button>

              {equiposSeleccionados.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Equipos seleccionados:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {equiposSeleccionados.map((equipo: EquipoSeleccionado) => (
                      <div key={equipo.tipoEquipoId} className="flex justify-between items-center bg-green-50 px-3 py-2 rounded border border-green-200">
                        <span className="text-sm font-medium text-green-700">{equipo.nombre}</span>
                        <span className="text-sm font-semibold text-green-800 bg-green-100 px-2 py-1 rounded">
                          {equipo.cantidad}u
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {showSuccess ? 'Cerrar' : 'Cancelar'}
              </button>
              <button
                type="submit"
                disabled={isLoading || isLoadingUser || !usuarioInfo || showSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Creando...
                  </>
                ) : showSuccess ? (
                  '¡Creado!'
                ) : (
                  'Crear Evento'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de selección de equipos */}
      <SeleccionEquipos
        isOpen={showModalEquipos}
        onClose={() => setShowModalEquipos(false)}
        equiposSeleccionados={equiposSeleccionados}
        onEquiposChange={handleEquiposSeleccionados}
      />

      {/* Modal de más información */}
{/*
      <ModalMasInfo 
        isOpen={showModalInfo}
        onClose={() => setShowModalInfo(false)}
      />
*/}
    </>
  );
}