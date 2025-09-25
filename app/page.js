// app/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import UserList from '../components/UsersList'
import CreateUserForm from '../components/CreateUserForm'
import EditAttributesForm from '../components/EditAttributesForm'


export default function Home() {
  const [usuarios, setUsuarios] = useState([])
  
  const [usuarioEditando, setUsuarioEditando] = useState(null) 
  const [errorMsg, setErrorMsg] = useState('')
  
  const [newCargoNombre, setNewCargoNombre] = useState('')
  const [newCargoSueldo, setNewCargoSueldo] = useState('')
  const [selectedHorarioId, setSelectedHorarioId] = useState('') 
  const [newTickeoHora, setNewTickeoHora] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5)) 
  const [newTickeoTipo, setNewTickeoTipo] = useState('entrada') 
  

  const fetchUsuarios = async () => {
    setErrorMsg('')
    const selectQuery = '*, id_horarios, cargos_usuarios(fecha_inicio, cargos(id, cargo, sueldo)), horarios(id, hora_ingreso, hora_salida), tickeos(fecha, hora, tipo)';

    const { data, error } = await supabase
      .from('usuarios')
      .select(selectQuery)
      .order('fecha', { foreignTable: 'tickeos', ascending: false })
      .order('hora', { foreignTable: 'tickeos', ascending: false });

    if (error) {
      console.error('Error fetching users (Check RLS!):', error)
      setErrorMsg(`Error de Carga (${error.code || 'PGRST100'}). Revisa la consola.`);
      setUsuarios([])
    } else {
      setUsuarios(data)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])
  
  const addUsuario = async (formData) => {
    setErrorMsg('')

    const { error } = await supabase
      .from('usuarios')
      .insert({ 
        nombre: formData.nombre, 
        edad: formData.edad,
        email: formData.email,
        contraseña: formData.contraseña,
        id_horarios: null
      })

    if (error) {
      console.error('Error adding user:', error)
      setErrorMsg(`Error al crear usuario: ${error.message}. (Verifica RLS INSERT en usuarios)`)
      return false
    } 
    return true
  }

  const updateUsuario = async (id, currentName, currentEmail) => {
    const newName = prompt(`Ingrese el nuevo nombre para ${currentName}:`, currentName)
    const newEmail = prompt(`Ingrese el nuevo email para ${currentName}:`, currentEmail)

    if (newName && newEmail) {
      const { error } = await supabase
        .from('usuarios')
        .update({ nombre: newName, email: newEmail }) 
        .eq('id', id)

      if (error) {
        console.error('Error updating user:', error)
        setErrorMsg(`Error al actualizar usuario: ${error.message}. (Verifica RLS UPDATE en usuarios)`)
      }
      else fetchUsuarios()
    }
  }

  const deleteUsuario = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario: ${name}? Esta acción eliminará sus datos asociados.`)) {
        setErrorMsg('');

        // 1. Eliminar tickeos
        const { error: tickeoError } = await supabase
            .from('tickeos')
            .delete()
            .eq('id_usuario', id);
        if (tickeoError) { console.error('Error deleting tickeos:', tickeoError); setErrorMsg(`Error al eliminar tickeos: ${tickeoError.message}.`); return; }

        // 2. Eliminar cargos_usuarios
        const { error: cargoRelError } = await supabase
            .from('cargos_usuarios')
            .delete()
            .eq('id_usuario', id);
        if (cargoRelError) { console.error('Error deleting cargo relations:', cargoRelError); setErrorMsg(`Error al eliminar relaciones de cargo: ${cargoRelError.message}.`); return; }

        // 3. Eliminar el USUARIO
        const { error: userError } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id);
        if (userError) {
            console.error('Error deleting user:', userError);
            setErrorMsg(`Error al eliminar usuario: ${userError.message}. (Verifica RLS DELETE en usuarios)`);
        } else {
            fetchUsuarios(); 
        }
    }
  }

  const addTickeo = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!usuarioEditando || !newTickeoHora || !newTickeoTipo) return;

    const { error } = await supabase
      .from('tickeos')
      .insert({
        id_usuario: usuarioEditando,
        fecha: new Date().toISOString().split('T')[0], 
        hora: newTickeoHora,
        tipo: newTickeoTipo,
      });

    if (error) {
      console.error('Error al registrar tickeo:', error);
      setErrorMsg(`Error al registrar tickeo: ${error.message}. (Verifica RLS INSERT en tickeos)`);
    } else {
      alert(`Tickeo de ${newTickeoTipo} registrado para hoy.`);
      fetchUsuarios(); 
    }
  };


  const asignarCargo = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!usuarioEditando || !newCargoNombre || !newCargoSueldo) return;

    const { data: cargoData, error: cargoError } = await supabase
      .from('cargos')
      .insert({
        cargo: newCargoNombre,
        sueldo: parseInt(newCargoSueldo),
      })
      .select('id') 
      .single();

    if (cargoError) {
      console.error('Error al insertar cargo:', cargoError);
      setErrorMsg(`Error al crear cargo: ${cargoError.message}. (Verifica RLS INSERT en cargos)`);
      return;
    }
    
    const newCargoId = cargoData.id;

    const { error: relError } = await supabase
      .from('cargos_usuarios')
      .insert({
        id_usuario: usuarioEditando,
        id_cargo: newCargoId,
        fecha_inicio: new Date().toISOString().split('T')[0]
      });

    if (relError) {
      console.error('Error al asignar cargo:', relError);
      setErrorMsg(`Error al asignar cargo: ${relError.message}. (Verifica RLS INSERT en cargos_usuarios)`);
    } else {
      alert(`Cargo '${newCargoNombre}' asignado correctamente.`);
      setNewCargoNombre('');
      setNewCargoSueldo('');
      fetchUsuarios(); 
    }
  };

  const asignarHorario = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!usuarioEditando || !selectedHorarioId) return;

    const { error } = await supabase
      .from('usuarios')
      .update({ id_horarios: selectedHorarioId }) 
      .eq('id', usuarioEditando);

    if (error) {
      console.error('Error al asignar horario:', error);
      setErrorMsg(`Error al asignar horario: ${error.message}. (Verifica RLS UPDATE en usuarios y que el ID exista en horarios)`);
    } else {
      alert(`Horario asignado correctamente.`);
      fetchUsuarios(); 
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-10 bg-gray-50">
      <h1 className="font-bold mb-8">Administración de Personal</h1>
      
      {errorMsg && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 w-full max-w-4xl" role="alert">
          <p className="font-bold">¡Error!</p>
          <p>{errorMsg}</p>
        </div>
      )}
      
      <CreateUserForm 
        addUsuario={addUsuario} 
        setErrorMsg={setErrorMsg} 
        fetchUsuarios={fetchUsuarios}
      />

      <EditAttributesForm
        usuarioEditando={usuarioEditando}
        setUsuarioEditando={setUsuarioEditando}
        addTickeo={addTickeo}
        asignarCargo={asignarCargo}
        asignarHorario={asignarHorario}
        newCargoNombre={newCargoNombre} setNewCargoNombre={setNewCargoNombre}
        newCargoSueldo={newCargoSueldo} setNewCargoSueldo={setNewCargoSueldo}
        selectedHorarioId={selectedHorarioId} setSelectedHorarioId={setSelectedHorarioId}
        newTickeoHora={newTickeoHora} setNewTickeoHora={setNewTickeoHora}
        newTickeoTipo={newTickeoTipo} setNewTickeoTipo={setNewTickeoTipo}
      />
      
      <h2 className="font-semibold mb-6">Lista de Usuarios ({usuarios.length})</h2>
      <UserList
        usuarios={usuarios}
        deleteUsuario={deleteUsuario}
        updateUsuario={updateUsuario}
        setUsuarioEditando={setUsuarioEditando}
        errorMsg={errorMsg}
        fetchUsuarios={fetchUsuarios}
      />
    </main>
  )
}