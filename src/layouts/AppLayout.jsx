import Sidebar from "../components/Sidebar"

export default function AppLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}