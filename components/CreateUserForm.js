'use client'
import { useState } from 'react'

export default function CreateUserForm({ addUsuario, setErrorMsg, fetchUsuarios }) {
  const [newNombre, setNewNombre] = useState('')
  const [newEdad, setNewEdad] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newNombre || !newEmail || !newPassword) {
      setErrorMsg("Todos los campos principales son obligatorios.");
      return;
    }
    
    const success = await addUsuario({
      nombre: newNombre,
      edad: parseInt(newEdad) || null,
      email: newEmail,
      contraseña: newPassword
    });

    if (success) {
      setNewNombre('');
      setNewEdad('');
      setNewEmail('');
      setNewPassword('');
      fetchUsuarios();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white rounded-lg shadow-md w-full max-w-2xl grid grid-cols-2 gap-4">
      <input type="text" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} placeholder="Nombre" className="p-2 border rounded text-black" required/>
      <input type="number" value={newEdad} onChange={(e) => setNewEdad(e.target.value)} placeholder="Edad" className="p-2 border rounded text-black"/>
      <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="p-2 border rounded text-black" required/>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Contraseña" className="p-2 border rounded text-black" required/>
      <button type="submit" className="col-span-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
        Crear Nuevo Usuario
      </button>
    </form>
  );
}