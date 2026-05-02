import { Outlet } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Outlet />
    </div>
  )
}