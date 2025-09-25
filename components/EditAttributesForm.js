'use client'
import { useState } from 'react';

const HORARIOS_FIJOS = [
    { id: 1, hora_ingreso: '08:00:00', hora_salida: '18:00:00' }, 
    { id: 2, hora_ingreso: '09:00:00', hora_salida: '20:00:00' }, 
];

export default function EditAttributesForm({ 
  usuarioEditando, 
  setUsuarioEditando,
  addTickeo, 
  asignarCargo, 
  asignarHorario,
  newCargoNombre, setNewCargoNombre,
  newCargoSueldo, setNewCargoSueldo,
  selectedHorarioId, setSelectedHorarioId,
  newTickeoHora, setNewTickeoHora,
  newTickeoTipo, setNewTickeoTipo
}) {
    
  if (!usuarioEditando) return null;

  
  const [activeTab, setActiveTab] = useState(1); 
  
  
  const tabs = [
    { id: 1, name: 'Registrar Tickeo' },
    { id: 2, name: 'Asignar Cargo' },
    { id: 3, name: 'Asignar Horario' },
  ];

  return (
    <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-lg w-full max-w-5xl">
      <h3 className="font-semibold mb-4">
        Asignar Atributos y Registrar Tickeo (ID: {usuarioEditando})
      </h3>

      {/*Menú de Navegación */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-2 px-4 text-center transition-colors duration-150 ease-in-out
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                : 'text-gray-600 hover:text-blue-500'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      <div className="p-4 border rounded-md bg-white">
        
        {/*Tickeo */}
        {activeTab === 1 && (
          <form onSubmit={addTickeo} className="max-w-md mx-auto">
            <label className="block font-bold mb-2 text-green-700">Registrar Tickeo (Hoy)</label>
            <div className='flex space-x-2 mb-3'>
              <input 
                type="time" 
                value={newTickeoHora} 
                onChange={(e) => setNewTickeoHora(e.target.value)} 
                className="w-1/2 p-2 border rounded text-black" 
                required
              />
              <select 
                value={newTickeoTipo} 
                onChange={(e) => setNewTickeoTipo(e.target.value)} 
                className="w-1/2 p-2 border rounded text-black" 
                required
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <button type="submit" className="w-full p-2 bg-green-700 text-white rounded hover:bg-green-800 font-bold">
              Guardar Tickeo
            </button>
          </form>
        )}

        {/*Cargo */}
        {activeTab === 2 && (
          <form onSubmit={asignarCargo} className="max-w-md mx-auto">
            <label className="block font-medium mb-2">Crear y Asignar Nuevo Cargo</label>
            <input 
              type="text" 
              value={newCargoNombre} 
              onChange={(e) => setNewCargoNombre(e.target.value)} 
              placeholder="Nombre del Cargo" 
              className="w-full p-2 border rounded mb-2 text-black" 
              required
            />
            <input 
              type="number" 
              value={newCargoSueldo} 
              onChange={(e) => setNewCargoSueldo(e.target.value)} 
              placeholder="Sueldo" 
              className="w-full p-2 border rounded mb-3 text-black" 
              required
            />
            <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
              Crear y Guardar Cargo
            </button>
          </form>
        )}

        {/*Horario */}
        {activeTab === 3 && (
          <form onSubmit={asignarHorario} className="max-w-md mx-auto">
            <label className="block font-medium mb-2">Asignar Horario Fijo</label>
            <select 
              value={selectedHorarioId}
              onChange={(e) => setSelectedHorarioId(e.target.value)}
              className="w-full p-2 border rounded mb-3 text-black"
              required
            >
              <option value="">Seleccione un Horario</option>
              {HORARIOS_FIJOS.map(h => (
                <option key={h.id} value={h.id}>
                  {h.hora_ingreso.substring(0, 5)} - {h.hora_salida.substring(0, 5)}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Guardar Horario
            </button>
          </form>
        )}

      </div>
      {/* --- Botón Cerrar (Fuera de las pestañas) --- */}
      <button 
        onClick={() => setUsuarioEditando(null)} 
        className="mt-4 p-2 w-full bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-medium"
      >
        Cancelar Edición y Cerrar
      </button>
    </div>
  );
}