document.addEventListener("DOMContentLoaded", function () {
    const squares = [];
    const body = document.querySelector("body");
    let selectedPiece = null;

     initialBoard = [
        "r", "n", "b", "q", "k", "b", "n", "r",
        "p", "p", "p", "p", "p", "p", "p", "p",
        "",  "",  "",  "",  "",  "",  "",  "",
        "",  "",  "",  "",  "",  "",  "",  "",
        "",  "",  "",  "",  "",  "",  "",  "",
        "",  "",  "",  "",  "",  "",  "",  "",
        "P", "P", "P", "P", "P", "P", "P", "P",
        "R", "N", "B", "Q", "K", "B", "N", "R"
    ];

    function initializeChessboard() {
        const container = document.createElement("div");
        container.className = "container";
        body.insertBefore(container, body.querySelector("nav"));

        initialBoard.forEach((piece, index) => {
            const square = document.createElement("div");
            square.classList.add((Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black");
            square.textContent = piece;
            square.style.color = piece === piece.toUpperCase() ? 'red' : 'green'; // Capital letters red, small letters green
            square.addEventListener('click', () => handleSquareClick(square, index));
            container.appendChild(square);
            squares.push(square);
        });
    }

    function handleSquareClick(square, index) {
        const piece = initialBoard[index];
        if (!selectedPiece && piece !== '') {
            selectedPiece = { square, index, piece };
            squares.forEach(square => square.classList.remove("highlight"));
            highlightAvailableMoves(index, piece);
        } else if (selectedPiece && square !== selectedPiece.square) {
            if (square.classList.contains("highlight")) {
                square.textContent = selectedPiece.piece;
                square.style.color = selectedPiece.square.style.color; 
                selectedPiece.square.textContent = "";
                initialBoard[selectedPiece.index] = ""; // Update initialBoard
                initialBoard[index] = selectedPiece.piece; // Update initialBoard
            }
            squares.forEach(square => square.classList.remove("highlight"));
            selectedPiece = null;
        }
    }

    function highlightAvailableMoves(index, piece) {
        const availableMoves = calculateAvailableMoves(index, piece);
        availableMoves.forEach(moveIndex => {
            squares[moveIndex].classList.add("highlight");
        });
    }

    function calculateAvailableMoves(pieceIndex, piece) {
        const moves = [];
        const row = Math.floor(pieceIndex / 8);
        const col = pieceIndex % 8;

        const isUpperCase = piece === piece.toUpperCase();
        const direction = isUpperCase ? -1 : 1;

        switch (piece.toLowerCase()) {
            case 'p': // Pawn
                const forwardOne = pieceIndex + direction * 8;
                if (forwardOne >= 0 && forwardOne < 64 && !squares[forwardOne].textContent) {
                    moves.push(forwardOne);
                }
                // Diagonal captures
                const captureLeft = pieceIndex + direction * 8 - 1;
                const captureRight = pieceIndex + direction * 8 + 1;
                if (captureLeft >= 0 && captureLeft < 64 && col > 0) {
                    const targetPiece = squares[captureLeft].textContent;
                    if (targetPiece && (isUpperCase !== (targetPiece === targetPiece.toUpperCase()))) {
                        moves.push(captureLeft);
                    }
                }
                if (captureRight >= 0 && captureRight < 64 && col < 7) {
                    const targetPiece = squares[captureRight].textContent;
                    if (targetPiece && (isUpperCase !== (targetPiece === targetPiece.toUpperCase()))) {
                        moves.push(captureRight);
                    }
                }
                break;
            case 'r': // Rook
                moves.push(...calculateLinearMoves(pieceIndex, row, col, isUpperCase, [-8, 8, -1, 1]));
                break;
            case 'n': // Knight
                const knightMoves = [
                    [-2, -1], [-1, -2], [1, -2], [2, -1],
                    [2, 1], [1, 2], [-1, 2], [-2, 1]
                ];
                knightMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const newIndex = newRow * 8 + newCol;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (!squares[newIndex].textContent || (isUpperCase !== (squares[newIndex].textContent === squares[newIndex].textContent.toUpperCase()))) {
                            moves.push(newIndex);
                        }
                    }
                });
                break;
            case 'b': // Bishop
                moves.push(...calculateLinearMoves(pieceIndex, row, col, isUpperCase, [-9, -7, 7, 9]));
                break;
            case 'q': // Queen
                moves.push(...calculateLinearMoves(pieceIndex, row, col, isUpperCase, [-8, 8, -1, 1, -9, -7, 7, 9]));
                break;
            case 'k': // King
                const kingMoves = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],        [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                kingMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const newIndex = newRow * 8 + newCol;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (!squares[newIndex].textContent || (isUpperCase !== (squares[newIndex].textContent === squares[newIndex].textContent.toUpperCase()))) {
                            moves.push(newIndex);
                        }
                    }
                });
                break;
        }
        return moves;
    }

    function calculateLinearMoves(pieceIndex, row, col, isUpperCase, directions) {
        const moves = [];
        directions.forEach(direction => {
            for (let i = 1; i < 8; i++) {
                const newIndex = pieceIndex + direction * i;
                const newRow = Math.floor(newIndex / 8);
                const newCol = newIndex % 8;
                if (newIndex >= 0 && newIndex < 64 && Math.abs(newRow - row) <= i && Math.abs(newCol - col) <= i) {
                    if (!squares[newIndex].textContent) {
                        moves.push(newIndex);
                    } else {
                        if (isUpperCase !== (squares[newIndex].textContent === squares[newIndex].textContent.toUpperCase())) {
                            moves.push(newIndex);
                        }
                        break;
                    }
                }
            }
        });
        return moves;
    }

    initializeChessboard();
});
