/**
 * Script para probar la conexión al backend
 * Ejecuta: node src/scripts/testConnection.cjs
 */

const API_URL = 'http://localhost:3000/api';

console.log('');
console.log('🚀 [Movilis] Probando conexión al backend...');
console.log('🔌 [Movilis] URL del backend:', API_URL);
console.log('');

// Probar conexión general (health check)
async function testHealthConnection() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      console.log('✅ [Health] Backend disponible en /health');
      return true;
    } else {
      console.log('⚠️ [Health] Backend respondió pero con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ [Health] No se pudo conectar al endpoint /health');
    return false;
  }
}

// Probar registro
async function testRegisterConnection() {
  console.log('');
  console.log('🧪 [Test] Probando endpoint de registro...');
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
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
      console.log('✅ [Registro] ¡Conexión exitosa!');
      console.log('✅ [Registro] Respuesta:', JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️ [Registro] Backend conectado pero respondió con error:');
      console.log('   Status:', response.status);
      console.log('   Mensaje:', data.message || data.error || 'Sin mensaje');
    }
    
    return true;
  } catch (error) {
    console.log('❌ [Registro] Error de conexión:', error.message);
    return false;
  }
}

// Ejecutar tests
async function runTests() {
  const healthOk = await testHealthConnection();
  const registerOk = await testRegisterConnection();
  
  console.log('');
  console.log('═══════════════════════════════════════════');
  if (healthOk || registerOk) {
    console.log('✅ RESULTADO: Backend CONECTADO');
  } else {
    console.log('❌ RESULTADO: Backend NO DISPONIBLE');
    console.log('');
    console.log('💡 Asegúrate de que el backend esté corriendo en:');
    console.log('   http://localhost:3000');
  }
  console.log('═══════════════════════════════════════════');
  console.log('');
}

runTests();

