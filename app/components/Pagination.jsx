
const Pagination = ({
    postsPerPage,
    totalPosts,
    setCurrentPage,
    currentPage,
}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (!totalPosts || totalPosts <= postsPerPage) return null;

    return (
        <>
            <div className="flex justify-center items-center gap-4 mb-10" role="navigation" aria-label="Pagination Navigation">
                {currentPage > 1 ? (
                    <button
                        key="prev"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        aria-label="Previous Page"
                    >
                        Previous
                    </button>
                ) : (
                    <span className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed select-none" aria-disabled="true">
                        Previous
                    </span>
                )}
                {pageNumbers.map((number) => (
                    <button
                        onClick={() => setCurrentPage(number)}
                        key={number}
                        className={`px-4 py-2 rounded hover:bg-indigo-700 ${
                            number === currentPage ? 'bg-indigo-800 text-white' : 'bg-indigo-600 text-white'
                        }`}
                        aria-current={number === currentPage ? 'page' : undefined}
                    >
                        {number}
                    </button>
                ))}
                {currentPage < Math.ceil(totalPosts / postsPerPage) ? (
                    <button
                        key="next"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                ) : (
                    <span className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed select-none" aria-disabled="true">
                        Next
                    </span>
                )}
            </div>
        </>
    );
};


export default Pagination;