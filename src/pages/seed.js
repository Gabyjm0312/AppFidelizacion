import { useState } from 'react'

export default function Seed() {
  const [log, setLog] = useState('')
  const [loading, setLoading] = useState(false)

  const [perfilAdminId, setPerfilAdminId] = useState('')
  const [adminNombre, setAdminNombre] = useState('Gabriel')
  const [sucursalNombre, setSucursalNombre] = useState('Patronato')
  const [sucursalDir, setSucursalDir] = useState('Recoleta')

  const [perfilEmpId, setPerfilEmpId] = useState('')
  const [empNombre, setEmpNombre] = useState('Empleado K')
  const [empCargo, setEmpCargo] = useState('Cajero')
  const [sucursalIdForEmp, setSucursalIdForEmp] = useState('')

  const [perfilCliId, setPerfilCliId] = useState('')
  const [cliNombre, setCliNombre] = useState('Cliente Demo')
  const [cliDoc, setCliDoc] = useState('11.111.111-1')
  const [sucursalIdForCli, setSucursalIdForCli] = useState('')

  const logMsg = (m) => setLog((prev) => `[${new Date().toLocaleTimeString()}] ${m}\n` + prev)

  async function call(action, payload) {
    setLoading(true)
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      logMsg(`${action} ✓ -> ${JSON.stringify(data)}`)
      return data
    } catch (e) {
      logMsg(`${action} ERROR: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <h3>Seed rápido</h3>
      <p className="text-muted">Usa este panel local para crear filas base con la <code>SERVICE_ROLE_KEY</code> (configurada en <code>.env.local</code>). No desplegar en producción.</p>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">1) Perfil Admin</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">auth.users.id (ADMIN)</label>
              <input className="form-control" value={perfilAdminId} onChange={e=>setPerfilAdminId(e.target.value)} placeholder="uuid de auth" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={adminNombre} onChange={e=>setAdminNombre(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} className="btn btn-dark mt-2" onClick={()=>call('perfil',{ id:perfilAdminId, nombre:adminNombre, rol:'admin' })}>Crear perfil admin</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">2) Admin + Sucursal</h5>
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">perfil_id (admin)</label>
              <input className="form-control" value={perfilAdminId} onChange={e=>setPerfilAdminId(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nombre admin</label>
              <input className="form-control" value={adminNombre} onChange={e=>setAdminNombre(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nombre sucursal</label>
              <input className="form-control" value={sucursalNombre} onChange={e=>setSucursalNombre(e.target.value)} />
            </div>
          </div>
          <div className="row g-2 mt-1">
            <div className="col-md-6">
              <label className="form-label">Dirección</label>
              <input className="form-control" value={sucursalDir} onChange={e=>setSucursalDir(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} className="btn btn-dark mt-2" onClick={async()=>{
            const r = await call('admin_y_sucursal',{ perfil_id: perfilAdminId, nombre_admin: adminNombre, nombre_sucursal: sucursalNombre, direccion: sucursalDir })
            if (r?.sucursal?.id) { setSucursalIdForEmp(r.sucursal.id); setSucursalIdForCli(r.sucursal.id) }
          }}>Crear admin + sucursal</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">3) Empleado</h5>
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">perfil_id (empleado)</label>
              <input className="form-control" value={perfilEmpId} onChange={e=>setPerfilEmpId(e.target.value)} placeholder="uuid de auth" />
            </div>
            <div className="col-md-4">
              <label className="form-label">sucursal_id</label>
              <input className="form-control" value={sucursalIdForEmp} onChange={e=>setSucursalIdForEmp(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={empNombre} onChange={e=>setEmpNombre(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Cargo</label>
              <input className="form-control" value={empCargo} onChange={e=>setEmpCargo(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} className="btn btn-dark mt-2" onClick={()=>call('empleado',{ perfil_id: perfilEmpId, sucursal_id: sucursalIdForEmp, nombre: empNombre, cargo: empCargo })}>Crear empleado</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">4) Cliente + Fidelización</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label">perfil_id (cliente)</label>
              <input className="form-control" value={perfilCliId} onChange={e=>setPerfilCliId(e.target.value)} placeholder="uuid de auth" />
            </div>
            <div className="col-md-3">
              <label className="form-label">sucursal_id</label>
              <input className="form-control" value={sucursalIdForCli} onChange={e=>setSucursalIdForCli(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={cliNombre} onChange={e=>setCliNombre(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Documento</label>
              <input className="form-control" value={cliDoc} onChange={e=>setCliDoc(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} className="btn btn-dark mt-2" onClick={async()=>{
            const r = await call('cliente_y_fid',{ perfil_id: perfilCliId, sucursal_id: sucursalIdForCli, nombre: cliNombre, documento: cliDoc })
            if (r?.cliente?.id) logMsg('Cliente creado con id: '+r.cliente.id)
          }}>Crear cliente + fidelización</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="card-title">Log</h6>
          <pre style={{whiteSpace:'pre-wrap'}}>{log}</pre>
          <a className="btn btn-link p-0" href="/">Volver al Home</a>
        </div>
      </div>
    </div>
  )
}
