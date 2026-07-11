import { Component } from 'react';

// Red de seguridad: si cualquier parte de la app falla al renderizar,
// muestra una pantalla de recuperación en vez de quedar en blanco.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Queda registrado en la consola para diagnóstico
    console.error('ErrorBoundary:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('showclinic_session');
      // Limpia también la sesión de Supabase Auth (admins)
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('sb-') || k.includes('supabase')) localStorage.removeItem(k);
      });
    } catch { /* ignore */ }
    window.location.href = '/';
  };

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F3', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '9999px', background: '#8B6F4E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontSize: '30px' }}>!</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#3D342E', margin: '0 0 8px' }}>Ups, algo salió mal</h1>
            <p style={{ fontSize: '15px', color: '#6B6259', lineHeight: 1.5, margin: '0 0 24px' }}>
              No pudimos cargar tu cuenta. Prueba recargar; si sigue igual, cierra sesión y vuelve a entrar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={this.handleReload}
                style={{ padding: '14px', borderRadius: '14px', border: 'none', background: '#3D342E', color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
                Recargar página
              </button>
              <button onClick={this.handleReset}
                style={{ padding: '14px', borderRadius: '14px', border: '1px solid #E0D8CE', background: 'white', color: '#8B6F4E', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Cerrar sesión y recargar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
