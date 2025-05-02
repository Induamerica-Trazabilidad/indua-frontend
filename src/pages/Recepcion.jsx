import CargaModal from '../components/CargaModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

import ReporteRecepcionPDF from '../components/ReporteRecepcionPDF';

function Recepcion() {
  const [cargas, setCargas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [codigoParaReporte, setCodigoParaReporte] = useState(null);
  const [idCargaReporte, setIdCargaReporte] = useState(null);
  const [faltantesPorLocal, setFaltantesPorLocal] = useState({});
  const [deterioradosPorLocal, setDeterioradosPorLocal] = useState({});
  const [renderizado, setRenderizado] = useState(false);

  useEffect(() => {
    cargarCargas();
  }, []);

  const cargarCargas = () => {
    axios.get('http://localhost:8080/api/cargas')
      .then(response => {
        const data = response.data;
        setCargas(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error al cargar cargas:', error);
        setCargas([]);
      });
  };

  const agruparBultosPorLocal = (estado, reporte) => {
    if (!reporte || !reporte.bultosProblema) return {};
    const filtrados = reporte.bultosProblema.filter(b => b.estadoRecepcion === estado);
    const agrupados = {};

    filtrados.forEach(b => {
      const clave = `${b.nombreLocal} - ${b.codigoLocal}`;
      if (!agrupados[clave]) {
        agrupados[clave] = [];
      }
      agrupados[clave].push(b.codigoBulto);
    });

    return Object.keys(agrupados)
      .sort()
      .reduce((obj, clave) => {
        obj[clave] = agrupados[clave];
        return obj;
      }, {});
  };

  const handleCargaRegistrada = async (idNuevaCarga) => {
    if (renderizado) return;
    setRenderizado(true);

    await cargarCargas();

    if (idNuevaCarga) {
      const cargasRes = await axios.get('http://localhost:8080/api/cargas');
      const carga = cargasRes.data.find(c => c.idCarga === idNuevaCarga);
      if (!carga) return;

      const codigoCarga = carga.codigoCarga;
      const res = await axios.get(`http://localhost:8080/api/cargas/reporte-recepcion/${idNuevaCarga}`);
      const reporte = res.data;

      setCodigoParaReporte(codigoCarga);
      setIdCargaReporte(idNuevaCarga);
      setFaltantesPorLocal(agruparBultosPorLocal('FALTANTE', reporte));
      setDeterioradosPorLocal(agruparBultosPorLocal('DETERIORADO', reporte));
      setMostrarReporte(true);
    }
  };

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
          onCargaRegistrada={handleCargaRegistrada}
        />

        {mostrarReporte && (
          <ReporteRecepcionPDF
            codigoCarga={codigoParaReporte}
            idCarga={idCargaReporte}
            faltantesPorLocal={faltantesPorLocal}
            deterioradosPorLocal={deterioradosPorLocal}
            onRenderComplete={() => {
              setMostrarReporte(false);
              setRenderizado(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default Recepcion;
