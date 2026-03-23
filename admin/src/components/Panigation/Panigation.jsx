import './Panigation.css'

function Pagination({ page, totalPages, setPage }) {

    const getPages = () => {
        let pages = []

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } 
        else {
            if (page <= 3) {
                pages = [1, 2, 3, 4, "...", totalPages]
            } 
            else if (page >= totalPages - 2) {
                pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
            } 
            else {
                pages = [1, "...", page - 1, page, page + 1, "...", totalPages]
            }
        }

        return pages
    }

    const pages = getPages()

    return (
        <div className="pagination">

            <button
                className="nav-btn"
                disabled={page === 1}
                onClick={() => { setPage(page - 1) 
                                window.scrollTo({ top: 0, behavior: "smooth" })
                }} 
            >
                ← Prev
            </button>

            {pages.map((p, index) =>
                p === "..." ? (
                    <span key={index} className="dots">...</span>
                ) : (
                    <button
                        key={index}
                        className={`page-btn ${page === p ? "active" : ""}`}
                        onClick={() => { setPage(p)
                                        window.scrollTo({top: 0, behavior: 'smooth'})
                        }}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="nav-btn"
                disabled={page === totalPages}
                onClick={() => {setPage(page + 1)
                                window.scrollTo({top: 0, behavior: 'smooth'})
                }}
            >
                Next →
            </button>

        </div>
    )
}

export default Pagination