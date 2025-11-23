// pages/api/seed.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(400).json({ error: 'Falta SERVICE_ROLE_KEY' })

  const { createClient } = await import('@supabase/supabase-js')
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // ───────── helpers ─────────
  const isUUID = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v || '')

  async function resolvePerfilId({ perfil_id, perfil_email }) {
    if (perfil_id) {
      if (!isUUID(perfil_id)) throw new Error(`perfil_id no es UUID: ${JSON.stringify(perfil_id)}`)
      return perfil_id
    }
    if (!perfil_email) return null
    const { data, error } = await admin.auth.admin.getUserByEmail(perfil_email)
    if (error) throw error
    return data?.user?.id ?? null
  }

  async function ensurePerfil(id, { nombre, rol }) {
    // crea/actualiza el perfil antes de insertar en empleado/cliente
    const { error } = await admin.from('perfiles').upsert(
      { id, nombre: nombre || null, rol },
      { onConflict: 'id' }
    )
    if (error) throw error
  }

  try {
    const { action, payload } = req.body || {}

    // 1) Crear perfil explícito
    if (action === 'perfil') {
      const id = await resolvePerfilId(payload)
      const { nombre, rol } = payload
      if (!id) throw new Error('No se pudo resolver perfil_id (pasa perfil_id o perfil_email)')
      await ensurePerfil(id, { nombre, rol })
      return res.json({ ok: true, id })
    }

    // 2) Admin + Sucursal
    if (action === 'admin_y_sucursal') {
      const perfil_id = await resolvePerfilId(payload)
      if (!perfil_id) throw new Error('No se pudo resolver perfil_id (admin)')
      const { nombre_admin, nombre_sucursal, direccion } = payload

      await ensurePerfil(perfil_id, { nombre: nombre_admin, rol: 'admin' })

      const { data: a, error: e1 } = await admin
        .from('admin')
        .insert({ perfil_id, nombre: nombre_admin })
        .select('*')
        .single()
      if (e1) throw e1

      const { data: s, error: e2 } = await admin
        .from('sucursal')
        .insert({ admin_id: a.id, nombre: nombre_sucursal, direccion })
        .select('*')
        .single()
      if (e2) throw e2

      return res.json({ ok: true, admin: a, sucursal: s })
    }

    // 3) Empleado
    if (action === 'empleado') {
      const perfil_id = await resolvePerfilId(payload)
      if (!perfil_id) throw new Error('No se pudo resolver perfil_id (empleado)')
      const { sucursal_id, nombre, cargo } = payload

      await ensurePerfil(perfil_id, { nombre, rol: 'empleado' })

      const { data, error } = await admin
        .from('empleado')
        .insert({ perfil_id, sucursal_id, nombre, cargo })
        .select('*')
        .single()
      if (error) throw error

      return res.json({ ok: true, empleado: data })
    }

    // 4) Cliente + Fidelización
    if (action === 'cliente_y_fid') {
      const perfil_id = await resolvePerfilId(payload)
      if (!perfil_id) throw new Error('No se pudo resolver perfil_id (cliente)')
      const { sucursal_id, nombre, documento } = payload

      await ensurePerfil(perfil_id, { nombre, rol: 'cliente' })

      const { data: c, error: e1 } = await admin
        .from('cliente')
        .insert({ perfil_id, sucursal_id, nombre, documento })
        .select('*')
        .single()
      if (e1) throw e1

      const { error: e2 } = await admin
        .from('fidelizacion')
        .insert({ cliente_id: c.id })
      if (e2) throw e2

      return res.json({ ok: true, cliente: c })
    }

    return res.status(400).json({ error: 'Acción inválida' })
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) })
  }
  
}
