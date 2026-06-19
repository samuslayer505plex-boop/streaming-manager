// Utilidades para autenticación biométrica (WebAuthn)

export const BiometricAuth = {
  // Verificar si el dispositivo soporta WebAuthn
  async isAvailable() {
    if (window.PublicKeyCredential === undefined) {
      return false
    }
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      return available
    } catch (err) {
      console.error('Error checking biometric availability:', err)
      return false
    }
  },

  // Registrar huella digital
  async registerFingerprint(userName) {
    try {
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: 'Streaming Manager',
          id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: userName,
          displayName: userName
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred'
        },
        timeout: 60000,
        attestation: 'direct'
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      })

      if (credential) {
        // Guardar referencia local (en producción iría a base de datos)
        const credentialData = {
          id: credential.id,
          userName: userName,
          registered: new Date().toISOString()
        }
        
        const stored = JSON.parse(localStorage.getItem('biometric_credentials') || '{}')
        stored[userName] = credentialData
        localStorage.setItem('biometric_credentials', JSON.stringify(stored))
        
        return { success: true, credential }
      }
      return { success: false, error: 'Registro cancelado' }
    } catch (err) {
      console.error('Error registering fingerprint:', err)
      return { success: false, error: err.message }
    }
  },

  // Autenticar con huella digital
  async authenticate(userName) {
    try {
      const stored = JSON.parse(localStorage.getItem('biometric_credentials') || '{}')
      
      if (!stored[userName]) {
        return { success: false, error: 'No se encontró huella registrada para este usuario' }
      }

      const credentialData = stored[userName]
      const credentialID = this.base64ToArrayBuffer(credentialData.id)

      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        allowCredentials: [{
          id: credentialID,
          type: 'public-key',
          transports: ['internal']
        }],
        timeout: 60000,
        userVerification: 'preferred'
      }

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })

      if (assertion) {
        return { success: true, assertion, userName }
      }
      return { success: false, error: 'Autenticación cancelada' }
    } catch (err) {
      console.error('Error authenticating:', err)
      return { success: false, error: err.message }
    }
  },

  // Métodos auxiliares para conversión de datos
  arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  },

  base64ToArrayBuffer(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  },

  // Obtener huellas registradas de un usuario
  getRegisteredFingerprints(userName) {
    const stored = JSON.parse(localStorage.getItem('biometric_credentials') || '{}')
    return stored[userName] ? [stored[userName]] : []
  },

  // Eliminar huella registrada
  removeFingerprint(userName) {
    const stored = JSON.parse(localStorage.getItem('biometric_credentials') || '{}')
    delete stored[userName]
    localStorage.setItem('biometric_credentials', JSON.stringify(stored))
  }
}

export default BiometricAuth
