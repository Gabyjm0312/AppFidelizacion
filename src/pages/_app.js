import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRouteGuard } from '../../lib/routeGuard'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Definir rutas y su nivel de protección
  const getRouteConfig = (pathname) => {
    const publicRoutes = ['/login', '/index', '/']
    const clienteRoutes = ['/cliente']
    const empleadoRoutes = ['/empleado']

    if (publicRoutes.includes(pathname)) {
      return { isPublic: true, requiredRol: null }
    }
    if (clienteRoutes.includes(pathname)) {
      return { isPublic: false, requiredRol: 'cliente' }
    }
    if (empleadoRoutes.includes(pathname)) {
      return { isPublic: false, requiredRol: 'empleado' }
    }
    // Otras rutas requieren sesión pero sin rol específico
    return { isPublic: false, requiredRol: null }
  }

  const config = getRouteConfig(router.pathname)
  useRouteGuard(config.requiredRol, config.isPublic)

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return <Component {...pageProps} />
}
