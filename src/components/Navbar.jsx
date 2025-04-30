import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const rol = localStorage.getItem('rol')
  const nombre = localStorage.getItem('nombre')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    navigate('/')
  }

  const puedeVer = (modulo) => {
    const accesos = {
      administrador: ['recepcion', 'transporte', 'despacho', 'bultos', 'usuarios'],
      operaciones: ['recepcion', 'transporte', 'despacho', 'bultos'],
      atarama: ['transporte', 'despacho'],
    }

    return accesos[rol]?.includes(modulo)
  }

  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-6 py-4 shadow">
      <div className="flex items-center space-x-8">
        <img src={logo} alt="Logo" className="h-8" />

        {puedeVer('recepcion') && <a href="/recepcion" className="hover:underline">Recepción</a>}
        {puedeVer('transporte') && <a href="/transporte" className="hover:underline">Transporte</a>}
        {puedeVer('despacho') && <a href="/despacho" className="hover:underline">Despacho</a>}
        {puedeVer('bultos') && <a href="/bultos" className="hover:underline">Bultos</a>}
        {puedeVer('usuarios') && <a href="/usuarios" className="hover:underline">Usuarios</a>}
      </div>

      <div className="flex items-center space-x-4">
        {nombre && <span className="text-sm text-gray-300">Bienvenido, {nombre}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      </div>

    </nav>
  )
}

export default Navbar
