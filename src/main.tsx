import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';
import { testBackendConnection, API_CONFIG } from '@/config';

// ============================================
// Probar conexión al backend al iniciar
// ============================================
console.log('🚀 [Movilis] Iniciando aplicación...');
console.log('🔌 [Movilis] Conectando al backend: http://localhost:3000/api');

testBackendConnection().then((connected) => {
  if (connected) {
    console.log('✅ [Movilis] ¡Backend conectado exitosamente!');
  } else {
    console.log('⚠️ [Movilis] Backend no disponible - usando modo demo');
  }
});

// ============================================
// Función para probar el login con cédula (solo desarrollo)
// ============================================
async function testLoginConnection() {
  console.log('🧪 [Test] Probando conexión al endpoint de login con cédula...');
  
  // Usar una cédula única para evitar conflictos
  const uniqueCedula = `TEST${Date.now()}`;
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
<<<<<<< HEAD
        cedula: uniqueCedula,
        name: "Usuario Test",
        email: `test${Date.now()}@example.com`
=======
        cedula: "1067890123"
>>>>>>> 745fdb5aed72aefc4a640d2191c6871f2231945a
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ [Test] ¡Conexión al backend exitosa!');
      console.log('✅ [Test] Usuario de prueba registrado:', data);
    } else if (response.status === 409) {
      // 409 = Conflict (usuario ya existe) - esto es normal si se ejecuta varias veces
      console.log('ℹ️ [Test] Usuario ya existe (409) - Backend está funcionando correctamente');
    } else {
      console.log('⚠️ [Test] Backend respondió con error:', data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ [Test] Error de conexión al backend:', error);
    console.log('❌ [Test] Asegúrate de que el backend esté corriendo en http://localhost:3000');
    return null;
  }
}

<<<<<<< HEAD
// Ejecutar test de registro al cargar (comentar en producción)
// testRegisterConnection(); // Comentado para evitar spam en consola
=======
// Ejecutar test de login al cargar (comentar en producción)
testLoginConnection();
>>>>>>> 745fdb5aed72aefc4a640d2191c6871f2231945a

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

