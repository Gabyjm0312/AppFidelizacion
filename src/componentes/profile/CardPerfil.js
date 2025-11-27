"use client";

import Image from "next/image";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";

export default function CardPerfil({data, children, handleChange}) {

  return (
  <div className="container my-4" style={{ maxWidth: 520 }}>

    <div className="card border-0 shadow-sm overflow-hidden">
      {/* PORTADA */}
      <div className="position-relative">
        <Image
          src={data?.coverPhoto}
          alt="profile cover"
          width={970}
          height={260}
          className="w-100"
          style={{
            height: 260,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <div className="position-absolute bottom-0 end-0 m-2 m-sm-3">
          <label
            htmlFor="coverPhoto"
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 mb-0"
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              className="visually-hidden"
              onChange={handleChange}
              accept="image/png, image/jpg, image/jpeg"
            />

            <CameraIcon />
            <span>Editar</span>
          </label>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4 p-lg-5 text-center">
        {/* AVATAR */}
        <div
          className="mx-auto position-relative"
          style={{ marginTop: -70, width: 176, height: 176 }}
        >
          <div className="position-relative bg-white border rounded-circle p-2 shadow-sm w-100 h-100 d-flex align-items-center justify-content-center">
            {data?.profilePhoto && (
              <>
                <Image
                  src={data?.profilePhoto}
                  width={160}
                  height={160}
                  className="rounded-circle"
                  alt="profile"
                />

                <label
                  htmlFor="profilePhoto"
                  className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center mb-1 me-1"
                  style={{ width: 34, height: 34, cursor: "pointer" }}
                >
                  <CameraIcon />

                  <input
                    type="file"
                    name="profilePhoto"
                    id="profilePhoto"
                    className="visually-hidden"
                    onChange={handleChange}
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {/* NOMBRE Y STATS */}
        <div className="mt-4">
          <h3 className="mb-1 fw-bold text-dark">
            {data?.name}
          </h3>
            {/* CONTENIDO EXTRA (por ejemplo, puntos y QR en /cliente) */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
);

}
