import calculateWinner from './rule';

class AI {
    constructor(level, piece) {
        this.level = level
        this.piece = piece
        this.caches = {}
    }
    putPiece(squares) {
        if (this.level === 0) {
            return this.putPiece0(squares)
        }
        else {
            return this.putPieceMinMax(squares, true)[1]
        }
    }

    putPiece0(squares) {
        for (var i = 0; i < squares.length; i++) {
            if (squares[i]) {
                continue
            }
            return i
        }
        return null
    }

    putPieceMinMax(squares, my_turn) {
        const winner = calculateWinner(squares);
        if (winner) {
            return [winner === this.piece ? 1 : -1, null];
        }
        if (squares.every(x => x !== null)) {
            return [0, null];
        }
        this.cnt++;

        const nextPiece = (!my_turn ^ (this.piece === 'X')) ? 'X' : 'O';
        const scores = [];
        for (var i = 0; i < squares.length; i++) {
            if (squares[i] !== null) {
                continue
            }
            const nextSquares = squares.slice();
            nextSquares[i] = nextPiece;
            const cache = this.getCache(nextSquares);
            if (cache) {
                scores.push([cache, i]);
            }
            else {
                const score = this.putPieceMinMax(nextSquares, !my_turn)[0] - 0;
                this.saveCache(nextSquares, score);
                scores.push([score, i]);
            }
        }
        if (scores.length === 0) {
            console.log('scores.length === 0');
        }

        if(scores.length > 9) {
            console.log(scores)
        }
        var best_score = null;
        var best_index = -1;
        for (var i = 0; i < scores.length; i++) {
            const score = scores[i][0];
            const square_index = scores[i][1];
            if (best_score === null) {
                best_score = score;
                best_index = square_index;
                continue
            }
            if ((best_score < score) ^ !my_turn) {
                best_score = score;
                best_index = square_index;
            }
        }
        
        if (best_index === -1) {
            console.log('===================');
            for (var j = 0; j < scores.length; j++) {
                console.log(scores[j]);
            }
        }
        return [best_score, best_index];
    }

    getCache(squares) {
        const bit_squares = this.squaresToBit(squares);
        return this.caches[bit_squares];
    }

    saveCache(squares, score) {
        const bit_squares = this.squaresToBit(squares);
        if (score > 1) {
            console.log('saveCache ' + score)
            console.log(squares)
        }
        this.caches[bit_squares] = score;
    }

    squaresToBit(squares) {
        // 3進数
        var bit_squares = 0;
        for (var i = 0; i < squares.length; i++) {
            const square = squares[i];
            if (square === null) {
                continue
            }
            if (square === this.piece) {
                bit_squares += 3 ** i
            }
            else {
                bit_squares += 3 ** i * 2
            }
        }
        return bit_squares
    }
}

export default AI