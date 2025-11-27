import Link from "next/link";

const Breadcrumb = ({ pageName }) => {
  return (
    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
      {/* Título de la página */}
      <h2 className="h4 fw-bold text-dark mb-2 mb-sm-0">
        {pageName}
      </h2>

      {/* Breadcrumb Bootstrap */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none">
              Dashboard
            </Link>
          </li>
          <li
            className="breadcrumb-item active text-primary"
            aria-current="page"
          >
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
