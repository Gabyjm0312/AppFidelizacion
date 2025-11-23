import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { supabase } from '../../lib/supabaseClient'
import { logout } from '../../lib/routeGuard'

export default function HomeCliente() {
  const [saldoCli, setSaldoCli] = useState(null)
  const [numeroCliente, setNumeroCliente] = useState(null)
  const [log, setLog] = useState('')
  const logMsg = (m) => setLog((p) => `[${new Date().toLocaleTimeString()}] ${m}\n` + p)

  const verMisPuntos = async () => {
    try {
   

      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) throw new Error('No hay sesión')

      const { data: meCli, error: eCli } = await supabase
        .from('cliente')
        .select('id, numero_cliente')
        .eq('perfil_id', user.id)
        .maybeSingle()
      if (eCli) throw eCli
      if (!meCli?.id) throw new Error('No se encontró cliente para este usuario')
        
      // guardar el número de cliente
      setNumeroCliente(meCli.numero_cliente)

      // traer mi saldo desde la vista usando ese id
      const { data, error } = await supabase
        .from('v_cliente_saldo')
        .select('puntos_totales')
        .eq('cliente_id', meCli.id)
        .maybeSingle()
      if (error) throw error

      const pts = data?.puntos_totales ?? 0
      setSaldoCli(pts)
      logMsg(`Saldo (cliente): ${pts}`)
    } catch (e) {
      logMsg('verMisPuntos ERROR: ' + (e.message || String(e)))
    }
  }

  return (
    <div className="container py-4" style={{maxWidth: 520}}>
      <h3 className="mb-3">Mis puntos</h3>

      <button className="btn btn-dark" onClick={verMisPuntos}>Ver mis puntos</button>
      {saldoCli !== null && <div className="mt-3">Saldo (cliente): <b>{saldoCli}</b></div>}
      
      {numeroCliente !== null && (
        <div className="mt-4 text-center">
          <p className="text-muted">Mi código QR</p>
          <QRCodeCanvas value={String(numeroCliente)} size={256} level="H" />
          <p className="mt-2 text-muted small">Cliente #: {numeroCliente}</p>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h6 className="card-title">Log</h6>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{log}</pre>
        </div>
      </div>

      <button className="btn btn-outline-danger mt-3" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
