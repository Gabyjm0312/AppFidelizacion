import Link from "next/link";
import GoogleSigninBoton from "../GoogleSigninBoton";
import SigninClave from "../SigninClave";

export default function Login() {
    
return (
  <>
    <GoogleSigninBoton text="Sign in" />

    {/* Separador "Or sign in with email" */}
    <div className="d-flex align-items-center justify-content-center my-4">
      <div className="flex-grow-1 border-top" />
      <div className="px-3 bg-white text-center fw-medium">
        Ingresa tu email y contraseña
      </div>
      <div className="flex-grow-1 border-top" />
    </div>

    {/* Formulario con email y password */}
    <div>
      <SigninClave />
    </div>

    {/* Link a registro */}
    <div className="mt-4 text-center">
      <p>
       Aun no tienes cuenta{" "}
        <Link
          href="/auth/sign-up"
          className="text-primary text-decoration-none"
        >
          Inicio
        </Link>
      </p>
    </div>
  </>
);


}