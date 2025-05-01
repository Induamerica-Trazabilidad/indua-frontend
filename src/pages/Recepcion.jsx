import CargaModal from '../components/CargaModal'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'

function Recepcion() {
  const [cargas, setCargas] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const cargarCargas = () => {
    axios.get('http://localhost:8080/api/cargas')
      .then(response => {
        const data = response.data
        console.log('Respuesta del backend:', data)
        setCargas(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Error al cargar cargas:', error)
        setCargas([]) // fallback para evitar estado inválido
      })
  }

  useEffect(() => {
    cargarCargas()
  }, [])

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-start p-6 text-white">
        <h1 className="text-3xl font-bold mb-6 mt-4">INGRESA UNA CARGA</h1>

        <div className="bg-white text-black rounded-xl shadow-lg w-full max-w-5xl overflow-hidden">
          <div className="overflow-y-auto max-h-[400px]">
            <table className="table-auto min-w-full border">
              <thead>
                <tr className="sticky top-0 z-10 bg-gray-100 font-bold text-sm">
                  <th className="border px-4 py-2">Fecha de Carga</th>
                  <th className="border px-4 py-2">Código de Carga</th>
                  <th className="border px-4 py-2">Placa</th>
                  <th className="border px-4 py-2">Dueño</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cargas) && cargas.map((carga, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{carga.fechaCarga}</td>
                    <td className="border px-4 py-2">{carga.codigoCarga}</td>
                    <td className="border px-4 py-2">{carga.placaCarreta}</td>
                    <td className="border px-4 py-2">{carga.duenoCarreta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-6 mt-8">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            INGRESAR NUEVA CARGA
          </button>

          <button
            onClick={() => alert('Función en desarrollo')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            GENERAR REPORTE
          </button>
        </div>

        <CargaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCargaRegistrada={cargarCargas}
        />
      </div>
    </Layout>
  )
}

export default Recepcion
