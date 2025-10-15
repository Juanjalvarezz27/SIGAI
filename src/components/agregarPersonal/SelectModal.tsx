"use client"

import { useRef, useEffect } from "react"
import { X, Check } from "lucide-react"

interface SelectModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  options: Array<{ id: number; nombre: string }>
  selectedValue: number
  onSelect: (value: number) => void
  disabled?: boolean
  loading?: boolean
}

export default function SelectModal({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  disabled,
  loading = false
}: SelectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-[60] p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de opciones */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelect(option.id)
                    onClose()
                  }}
                  disabled={disabled}
                  className={`w-full text-left p-3 rounded-md transition-colors flex items-center justify-between ${
                    selectedValue === option.id
                      ? 'bg-[#001F3F] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="flex-1">{option.nombre}</span>
                  {selectedValue === option.id && (
                    <Check size={16} className="ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}