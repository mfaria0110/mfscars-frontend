import { useUIStore } from "../store/uiStore"

export default function GlobalLoading() {

  const { loading } = useUIStore()

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-3">

        {/* 🔥 SPINNER */}
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

        <span className="text-sm">Carregando...</span>

      </div>

    </div>
  )
}