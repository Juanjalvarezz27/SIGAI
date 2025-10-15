"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import AddPersonalModal from "./AddPersonalToggle"

export default function AddPersonalButton() {
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
          <Users className="text-white" size={32} />
        </div>
        <div>
          <h2 className="text-[#001F3F] font-bold text-lg">Agregar Personal</h2>
          <p className="text-[#001F3F] text-sm">Añadir nuevo personal</p>
        </div>
      </div>

      <AddPersonalModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}