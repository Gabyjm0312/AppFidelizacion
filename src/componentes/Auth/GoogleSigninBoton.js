import { GoogleIconos } from "../../assets/iconos";

export default function GoogleSigninBoton({ text }) {
  return (
    <button
  className="btn w-100 d-flex align-items-center justify-content-center gap-2 rounded border bg-light px-3 py-2 fw-medium"
>   <GoogleIconos />
      {text} Inicio con Google
    </button>
  );
}

