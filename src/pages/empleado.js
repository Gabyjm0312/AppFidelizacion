import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { logout } from '../../lib/routeGuard'

export default function Home() {

  const [clienteIdTarget, setClienteIdTarget] = useState(0)
  const [puntos, setPuntos] = useState(100)
  const [desc, setDesc] = useState('Compra demo #1')

  const [saldoEmp, setSaldoEmp] = useState(null)
  const [log, setLog] = useState('')

  const logMsg = (m) => setLog((prev) => `[${new Date().toLocaleTimeString()}] ${m}\n` + prev)


  const sumarPuntos = async () => {
    try {
     
      if (!clienteIdTarget) throw new Error('Falta Cliente ID (uuid)')
    
    const { data: cliente, error: errorCliente } = await supabase
      .from('cliente')
      .select('id')
      .eq('numero_cliente', clienteIdTarget)
      .maybeSingle()
    
    if (errorCliente || !cliente) throw new Error('Cliente no encontrado');
    

      await supabase.rpc('rpc_empleado_sumar_puntos', {
        p_cliente_id: cliente.id,
        p_puntos: Number(puntos),
        p_desc: desc || null
      })
      logMsg(`+${puntos} puntos aplicados al cliente ${clienteIdTarget}`)
    } catch (e) {
      logMsg('sumarPuntos ERROR: ' + e.message)
    }
  }

const verSaldoEmpleado = async () => {
  try {
    if (!clienteIdTarget) throw new Error('Falta Cliente ID')
      if (!Number.isFinite(clienteIdTarget) || clienteIdTarget <= 0) {
  throw new Error('Por favor ingresa un número de cliente válido');
}  

    const { data, error, status } = await supabase
      .from('v_cliente_saldo')
      .select('puntos_totales')
      .eq('numero_cliente', clienteIdTarget)
      .maybeSingle()

    if (error) throw error

    const pts = data?.puntos_totales ?? 0
    setSaldoEmp(pts)
    logMsg(`Saldo (empleado): ${pts}`)
  } catch (e) {
  
    logMsg('verSaldoEmpleado ERROR: ' + (e.message || String(e)))
  }}

  const canjearPuntos = async () => {
  try {
    if (!clienteIdTarget) throw new Error('Falta Cliente ID')

        const { data: cliente, error: errorCliente } = await supabase
      .from('cliente')
      .select('id')
      .eq('numero_cliente', clienteIdTarget)
      .maybeSingle()
    
    if (errorCliente || !cliente) throw new Error('Cliente no encontrado');
    

    await supabase.rpc('rpc_empleado_canjear', {
  p_cliente_id: cliente.id,
  p_premio_id: null,                 // <- así fuerza la versión de 3 parámetros
  p_nota: 'Canje total desde demo'
})
    logMsg('Canje realizado ✓')
  } catch (e) {
    logMsg('canjearPuntos ERROR: ' + e.message)
  }
}



  return (
    <div className="container py-4">
      <h3 className="mb-3">Loyalty – Mini Playground (Next.js + Supabase + Bootstrap)</h3>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">Cliente ID (uuid)</label>
                <input className="form-control" placeholder="uuid cliente" value={clienteIdTarget} onChange={e=>setClienteIdTarget(Number(e.target.value))} />
              </div>
              <div className="row g-2">
                <div className="col-4">
                  <input type="number" className="form-control" value={puntos} onChange={e=>setPuntos(Number(e.target.value))} />
                </div>
                <div className="col-8">
                  <input className="form-control" placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={sumarPuntos}>Sumar puntos</button>
                <button className="btn btn-danger" onClick={canjearPuntos}>Canjear (reset)</button>
                <button className="btn btn-outline-secondary" onClick={verSaldoEmpleado}>Ver saldo (empleado)</button>
              </div>
              {saldoEmp !== null && <div className="mt-2">Saldo visto por empleado: <b>{saldoEmp}</b></div>}
            </div>
          </div>
        </div>

      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h6 className="card-title">Log</h6>
          <pre style={{whiteSpace:'pre-wrap'}}>{log}</pre>
        </div>
      </div>

      <button className="btn btn-outline-danger mt-3" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
