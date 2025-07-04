import React from 'react';
import { Button, ButtonGroup, Badge } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, totalTasks, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-4">
            <ButtonGroup>
                <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    &laquo; Prev
                </Button>

                {currentPage > 3 && (
                    <>
                        <Button
                            variant={1 === currentPage ? "primary" : "outline-primary"}
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </Button>
                        {currentPage > 4 && <Button variant="outline-primary disabled">...</Button>}
                    </>
                )}

                {getPageNumbers().map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "outline-primary"}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}

                {currentPage < totalPages - 2 && (
                    <>
                        {currentPage < totalPages - 3 && <Button variant="outline-primary disabled">...</Button>}
                        <Button
                            variant={totalPages === currentPage ? "primary" : "outline-primary"}
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next &raquo;
                </Button>
            </ButtonGroup>

            <Badge bg="info" className="ms-3">
                Page {currentPage} of {totalPages} | {totalTasks} tasks
            </Badge>
        </div>
    );
}

export default Pagination;