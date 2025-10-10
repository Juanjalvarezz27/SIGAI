"use client"

interface LoginSuccessPopupProps {
  isVisible: boolean
}
//Definimos que se muestre y no se muestre el PopUp
export default function LoginSuccessPopup({ isVisible }: LoginSuccessPopupProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Loader principal */}
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Iniciando Sesión
          </h3>
          
          <p className="text-gray-600">
            Verificando credenciales...
          </p>
        </div>
      </div>
    </div>
  )
}