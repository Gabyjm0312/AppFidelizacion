import Link from 'next/link'
import { useState } from "react";
import { useRouter } from 'next/router'
import InputGroup from '../FormElementos/InputGroup'
import  {EmailIcon,ClaveIcon} from '../../assets/iconos'
import { supabase } from '../../../lib/supabaseClient'
import { getUserRol } from '../../../lib/routeGuard'
import { Checkbox } from "../FormElementos/checkbox/checkbox";


export default function Login() {
  const router = useRouter()

  const [data, setData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const redirectByRol = async (user) => {
    const rol = await getUserRol(user)
    if (rol === 'empleado') return router.replace('/empleado')
    if (rol === 'cliente')  return router.replace('/cliente')
    if (rol === 'admin')    return router.replace('/admin')
    // fallback
    return router.replace('/')
  }

   const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const { data: loadingData, error } = await supabase.auth.signInWithPassword({ 
        email: data.email, 
        password: data.password });
      if (error) throw error
      const user = loadingData?.user
      if (!user) throw new Error('No se obtuvo el usuario tras login')
      await redirectByRol(user)
    } catch (err) {
      setMsg(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{maxWidth: 480}}>
      <h3 className="mb-3">Iniciar sesión</h3>

      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={onSubmit} className="card p-3">
         <InputGroup
          label="Email"
          type="email"
          placeholder="tu-correo@gmail.com"
          name="email"
          required
          handleChange={handleChange}
          value={data.email}
          iconPosition="left"
          icon={<EmailIcon width={18} height={18} />}
        />

       <InputGroup
          label="Contraseña"
          type="password"
          placeholder="********"
          name="password"
          required
          handleChange={handleChange}
          value={data.password}
          iconPosition="left"
          icon={<ClaveIcon width={18} height={18} />}
          height="sm"
        />

        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link href="/auth/olvidaste-contraseña" className="link-primary">
            Olvidaste tu clave
        </Link>


        <button 
          className="btn btn-dark mt-3 w-100 d-flex align-items-center justify-content-center gap-2" 
          type="submit" 
          disabled={loading}
          >
          {loading ? 'Entrando…' : 'Entrar'}
          {loading && (
            <span className="spinner-border spinner-border-sm" />
          )}
        </button>
      </form>

      <div className="mt-3">
        <a href="/">Volver al inicio</a>
      </div>
    </div>
  )
}
