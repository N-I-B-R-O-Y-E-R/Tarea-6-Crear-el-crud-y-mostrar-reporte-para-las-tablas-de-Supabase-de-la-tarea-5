// components/UserList.js
'use client'
import React from 'react';

export default function UserList({ usuarios, deleteUsuario, updateUsuario, setUsuarioEditando, errorMsg, fetchUsuarios }) {
    
  return (
    <div className="w-full max-w-4xl space-y-6">
      {usuarios.length === 0 && !errorMsg && <p className="text-center">No hay usuarios registrados.</p>}
      
      {usuarios.map((usuario) => {
        const cargoActual = usuario.cargos_usuarios?.[0]?.cargos;
        const horario = usuario.horarios; 
        const tickeos = usuario.tickeos || [];
        
        return (
          <div key={usuario.id} className="p-6 bg-white border rounded-lg shadow-xl">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <strong className="">{usuario.nombre}</strong> 
                <span className=""> (ID: {usuario.id} | {usuario.edad} años)</span>
                <p className="">{usuario.email}</p>
              </div>
              <div className="space-x-2 flex-shrink-0 flex items-center">
                <button 
                  onClick={() => setUsuarioEditando(usuario.id)} 
                  className="p-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition font-bold"
                >
                  Asignar/Tickear
                </button>
                <button onClick={() => updateUsuario(usuario.id, usuario.nombre, usuario.email)} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                  Datos Básicos
                </button>
                <button onClick={() => deleteUsuario(usuario.id, usuario.nombre)} className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                  Eliminar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              
              <div>
                <h4 className="font-semibold mb-1">Cargo Asignado</h4>
                <p>
                  <span className="font-medium">Puesto:</span> 
                  <span className="ml-1">{cargoActual?.cargo || 'N/A'}</span> 
                </p>
                <p>
                  <span className="font-medium">Sueldo:</span>
                  <span className="ml-1">${cargoActual?.sueldo || 'N/A'}</span>
                </p>
                <p className="mt-1">
                  Inicio: {usuario.cargos_usuarios?.[0]?.fecha_inicio || 'N/A'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Horario Asignado</h4>
                <p>
                  <span className="font-medium">Ingreso:</span>
                  <span className="ml-1">{horario?.hora_ingreso?.substring(0, 5) || 'N/A'}</span>
                </p>
                <p>
                  <span className="font-medium">Salida:</span>
                  <span className="ml-1">{horario?.hora_salida?.substring(0, 5) || 'N/A'}</span>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Tickeos Totales: ({tickeos.length})</h4>
                <ul className='list-none'>
                  {tickeos.slice(0, 3).map((t, index) => ( 
                    <li key={index} className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                        <span>{t.fecha}</span> a las 
                        <span className="ml-1">{t.hora.substring(0, 5)}</span> 
                        (<span>{t.tipo.toUpperCase()}</span>)
                    </li>
                  ))}
                </ul>
                {tickeos.length === 0 && <p>Sin registros de tickeo.</p>}
                {tickeos.length > 3 && <p className="mt-1">... y {tickeos.length - 3} más.</p>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}