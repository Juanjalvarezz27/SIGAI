"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import AddAdminModal from "./AddAdminModal"

export default function AddAdminButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div 
        onClick={openModal}
        className="flex items-center gap-4 p-3 bg-white/80 rounded-2xl hover:bg-white transform transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        <div className="bg-[#001F3F] p-3 rounded-lg">
          <UserPlus className="text-white" size={32} />
        </div>
        <div>
          <h2 className="text-[#001F3F] font-bold text-lg">Agregar Admin</h2>
          <p className="text-[#001F3F] text-sm">Añadir nuevo administrador</p>
        </div>
      </div>

      <AddAdminModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}