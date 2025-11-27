import LoginForm from "@/src/componentes/Auth/Login"; // tu formulario con supabase
/* import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"; */

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="row g-0 align-items-stretch">
                {/* Columna del formulario */}
                <div className="col-12 col-xl-6">
                  <div className="p-4 p-sm-5">
                    <LoginForm />
                  </div>
                </div>

                {/* Columna derecha con info / imagen */}
                <div className="d-none d-xl-block col-xl-6">
                  <div className="h-100 p-5 bg-light d-flex flex-column rounded-end-3">
                    <Link href="/" className="mb-4 d-inline-block">
                      <Image
                        src="/images/logo/logo.png"
                        alt="Logo"
                        width={176}
                        height={32}
                        className="img-fluid"
                      />
                    </Link>

                    <p className="mb-2 fs-5 fw-medium text-dark">
                      Inicia sesión en tu cuenta
                    </p>

                    <h1 className="mb-3 fs-3 fw-bold text-dark">
                      ¡Bienvenido de nuevo!
                    </h1>

                    <p className="mb-4 text-muted">
                      Por favor ingresa a tu cuenta completando los campos del
                      formulario.
                    </p>

                    <div className="mt-auto text-center">
                      <Image
                        src="/images/decoracion/decoracion.png"
                        alt="Decoración"
                        width={405}
                        height={325}
                        className="img-fluid opacity-75"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
