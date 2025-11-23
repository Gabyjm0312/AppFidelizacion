import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Home() {
  const [empEmail, setEmpEmail] = useState('empleado@test.com')
  const [empPass, setEmpPass] = useState('Empleado#12345')
  const [empToken, setEmpToken] = useState('')

  const [cliEmail, setCliEmail] = useState('cliente@test.com')
  const [cliPass, setCliPass] = useState('Cliente#12345')
  const [cliToken, setCliToken] = useState('')

  const [clienteIdTarget, setClienteIdTarget] = useState('')
  const [puntos, setPuntos] = useState(100)
  const [desc, setDesc] = useState('Compra demo #1')

  const [saldoEmp, setSaldoEmp] = useState(null)
  const [saldoCli, setSaldoCli] = useState(null)
  const [log, setLog] = useState('')

  const logMsg = (m) => setLog((prev) => `[${new Date().toLocaleTimeString()}] ${m}\n` + prev)

  const loginEmpleado = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: empEmail, password: empPass })
      if (error) throw error
      setEmpToken(data.session?.access_token || '')
      logMsg('Empleado logueado ✓')
    } catch (e) {
      logMsg('Empleado login ERROR: ' + e.message)
    }
  }

  const loginCliente = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cliEmail, password: cliPass })
      if (error) throw error
      setCliToken(data.session?.access_token || '')
      logMsg('Cliente logueado ✓')
    } catch (e) {
      logMsg('Cliente login ERROR: ' + e.message)
    }
  }

  const call = async (path, method = 'POST', token, body = null) => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`
    const res = await fetch(url, {
      method,
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`HTTP ${res.status}: ${t}`)
    }
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return res.json()
    return null
  }

  const sumarPuntos = async () => {
    try {
      if (!empToken) throw new Error('Primero loguea el empleado')
      if (!clienteIdTarget) throw new Error('Falta Cliente ID (uuid)')
      await call('rpc/rpc_empleado_sumar_puntos', 'POST', empToken, {
        p_cliente_id: clienteIdTarget,
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
      if (!empToken) throw new Error('Primero loguea el empleado')
      if (!clienteIdTarget) throw new Error('Falta Cliente ID')
      const qs = new URLSearchParams({ 'cliente_id': `eq.${clienteIdTarget}` })
      const data = await call(`v_cliente_saldo?${qs.toString()}`, 'GET', empToken)
      setSaldoEmp(data?.[0]?.puntos_totales ?? 0)
      logMsg(`Saldo (empleado): ${data?.[0]?.puntos_totales ?? 0}`)
    } catch (e) {
      logMsg('verSaldoEmpleado ERROR: ' + e.message)
    }
  }

  const verMisPuntos = async () => {
    try {
      if (!cliToken) throw new Error('Primero loguea el cliente')
      const data = await call('rpc/rpc_mis_puntos', 'POST', cliToken, {})
      const pts = data?.[0]?.puntos_totales ?? 0
      setSaldoCli(pts)
      logMsg(`Saldo (cliente): ${pts}`)
    } catch (e) {
      logMsg('verMisPuntos ERROR: ' + e.message)
    }
  }

  const canjearPuntos = async () => {
  try {
    if (!empToken) throw new Error('Primero loguea el empleado')
    if (!clienteIdTarget) throw new Error('Falta Cliente ID')
    await call('rpc/rpc_empleado_canjear', 'POST', empToken, {
  p_cliente_id: clienteIdTarget,
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
      <div className="alert alert-warning">Coloca tus claves en <code>.env.local</code> y asegúrate que tu esquema SQL ya está desplegado.</div>

      <div className="mb-3">
        <a href="/seed" className="btn btn-warning btn-sm">Ir a Seed rápido</a>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Empleado</h5>
              <div className="row g-2">
                <div className="col-6">
                  <input className="form-control" placeholder="email" value={empEmail} onChange={e=>setEmpEmail(e.target.value)} />
                </div>
                <div className="col-6">
                  <input className="form-control" placeholder="password" type="password" value={empPass} onChange={e=>setEmpPass(e.target.value)} />
                </div>
              </div>
              <button className="btn btn-dark mt-2" onClick={loginEmpleado}>Login Empleado</button>

              <hr />
              <div className="mb-2">
                <label className="form-label">Cliente ID (uuid)</label>
                <input className="form-control" placeholder="uuid cliente" value={clienteIdTarget} onChange={e=>setClienteIdTarget(e.target.value)} />
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

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Cliente</h5>
              <div className="row g-2">
                <div className="col-6">
                  <input className="form-control" placeholder="email" value={cliEmail} onChange={e=>setCliEmail(e.target.value)} />
                </div>
                <div className="col-6">
                  <input className="form-control" placeholder="password" type="password" value={cliPass} onChange={e=>setCliPass(e.target.value)} />
                </div>
              </div>
              <button className="btn btn-dark mt-2" onClick={loginCliente}>Login Cliente</button>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={verMisPuntos}>Ver mis puntos</button>
              </div>
              {saldoCli !== null && <div className="mt-2">Saldo (cliente): <b>{saldoCli}</b></div>}
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
    </div>
  )
}
