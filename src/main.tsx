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
// Función para probar el registro (solo desarrollo)
// ============================================
async function testRegisterConnection() {
  console.log('🧪 [Test] Probando conexión al endpoint de registro...');
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Usuario Test",
        email: "test@example.com",
        password: "123456"
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ [Test] ¡Conexión al backend exitosa!');
      console.log('✅ [Test] Respuesta del servidor:', data);
    } else {
      console.log('⚠️ [Test] Backend respondió con error (pero está conectado):', data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ [Test] Error de conexión al backend:', error);
    console.log('❌ [Test] Asegúrate de que el backend esté corriendo en http://localhost:3000');
    return null;
  }
}

// Ejecutar test de registro al cargar (comentar en producción)
testRegisterConnection();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

