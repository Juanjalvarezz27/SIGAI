"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import EditProfileModal from "./EditProfileModal"

export default function EditProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      {/* Cuadrado interno */}
      <div 
        onClick={openModal}
        className="bg-[#A0C4FF] rounded-2xl w-42 h-38 flex flex-col items-center justify-center mx-auto transform transition-all duration-200 hover:scale-105 cursor-pointer group"
      >
        <h2 className="text-[#001F3F] text-center text-xl font-semibold mb-2">Editar Perfil</h2>
        <Settings className="text-[#001F3F]" strokeWidth={1.5} size={56} />
        <div className="mt-4 w-8 h-1 rounded-full transition-all duration-300 group-hover:w-16 bg-[#001F3F]" />
      </div>

      {/* Modal */}
      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  )
}