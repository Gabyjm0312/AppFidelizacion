import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

/**
 * Hook para proteger rutas según rol (lado cliente)
 * @param {string} requiredRol - 'cliente', 'empleado', 'admin', o null si solo requiere estar logueado
 * @param {boolean} isPublic - true si la ruta es pública (login, index)
 */
export function useRouteGuard(requiredRol = null, isPublic = false) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        // Ruta pública y sin sesión -> permitir
        if (isPublic && !session) {
          return
        }

        // Ruta protegida sin sesión -> redirigir a login
        if (!session && !isPublic) {
          if(router.pathname !=='/login')
            router.replace('/login')
          return
        }

        // Si tiene sesión pero intenta acceder a login -> redirigir al dashboard
        if (session && router.pathname === '/login') {
          const rol = await getUserRol(session.user)
          redirectByRol(rol)
          return
        }

        // Si requiere un rol específico, verificar
        if (requiredRol && session) {
          const rol = await getUserRol(session.user)
          
          // Rol no coincide -> redirigir al dashboard correcto
          if (rol !== requiredRol) {
            redirectByRol(rol)
            return
          }
        }
      } catch (error) {
        console.error('Error en route guard:', error)
          if(router.pathname !=='/login')
            router.replace('/login')
        
      }
    }

    checkAuth()
  }, [router, requiredRol, isPublic])
}

/**
 * Obtiene el rol del usuario
 */
export async function getUserRol(user) {
  if (!user) return null

  try {
    // 1) Intentar desde user_metadata
    const rolMeta = user?.user_metadata?.rol
    if (rolMeta) return rolMeta

    // 2) Si no, consultar DB
    const { data, error } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .maybeSingle()

    if (error) throw error
    return data?.rol || null
  } catch (error) {
    console.error('Error obteniendo rol:', error)
    return null
  }
}

/**
 * Redirige según el rol del usuario
 */
export function redirectByRol(rol) {
  if (typeof window === 'undefined') return

  // Use full-page redirect to avoid calling hooks outside React
  // and to prevent client router replace loops that trigger
  // repeated /_next/data requests during navigation in dev.
  switch (rol) {
    case 'empleado':
      window.location.replace('/empleado')
      break
    case 'cliente':
      window.location.replace('/cliente')
      break
    case 'admin':
      window.location.replace('/admin')
      break
    default:
      window.location.replace('/')
  }
}

/**
 * Logout
 */
export async function logout() {
  try {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  } catch (error) {
    console.error('Error en logout:', error)
  }
}
