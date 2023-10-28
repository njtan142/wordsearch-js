const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initCanvas = () => {
    canvas.width = 1200;
    canvas.height = 700;
}

initCanvas();


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Point(this.x, this.y);
    }
}
let timer = 81;

const square_size = 70;
const columns = Math.floor((canvas.width - 100) / square_size)
const rows = Math.floor((canvas.height - 150 - 50) / square_size)
const words_count = 10
const startPoint = new Point(
    (canvas.width - (columns * square_size)) / 2,
    ((canvas.height - (rows * square_size)) / 2) + 10
);

console.log(square_size, words_count, columns, rows)



const drawTitle = (title, x = canvas.width / 2, y = 50, fontsize = 55) => {
    context.font = fontsize + "px monospace";
    context.fillStyle = "#E04A1F";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(title, x, y);
}

const drawLine = (p1, p2) => {
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
};


const drawGrid = (start, square_size, columns, rows) => {
    const end_horizontal = start.x + (square_size * columns);
    const end_vertical = start.y + (square_size * rows);

    for (let i = 0; i < columns + 1; i++) {
        const columnPoint = new Point(start.x + (i * square_size), start.y);
        drawLine(columnPoint, new Point(columnPoint.x, end_vertical));
    }

    for (let i = 0; i < rows + 1; i++) {
        const rowPoint = new Point(start.x, start.y + (i * square_size));
        drawLine(rowPoint, new Point(end_horizontal, rowPoint.y));
    }

    drawLine(start, new Point(end_horizontal, start.y));

}


const getRandomLetter = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomNumberWeighted = (min, max, weight) => {
    const range = max - min;
    const laterHalfWeight = weight; // Adjust this value to control the preference for the later half.

    // Calculate the probabilities for each half of the range.
    const probabilityEarlyHalf = 1 / (laterHalfWeight + 1);
    const probabilityLaterHalf = laterHalfWeight / (laterHalfWeight + 1);

    // Generate a random number to determine which half to choose.
    const randomValue = Math.random();

    //console.log(weight, probabilityEarlyHalf, randomValue);

    if (randomValue < probabilityEarlyHalf) {
        // Choose a random number from the early half of the range.
        return getRandomNumber(min, Math.floor(range / 2));
    } else {
        // Choose a random number from the later half of the range.
        return getRandomNumber(Math.floor(range / 2), max);
    }
}

word_array = uniqueArray;
const getRandomWords = (count, commonWords) => {
    const randomWords = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * commonWords.length);
        if (commonWords[randomIndex].length < rows) {
            randomWords.push(commonWords[randomIndex]);
        } else {
            i--;
        }

    }
    return randomWords;
}

let board = [];
let worded_board = []
let words = getRandomWords(words_count, word_array);



const fillBoard = (board, random = true) => {
    for (let i = 0; i < rows; i++) {
        const newRow = [];
        for (let j = 0; j < columns; j++) {
            if (random) {
                newRow.push(getRandomLetter());
            } else {
                newRow.push(null);
            }
        }
        board.push(newRow);
    }
}

const getDirectionDelta = (direction) => {
    const deltas = {
        1: { dx: 0, dy: -1 },
        2: { dx: 0, dy: 1 },
        3: { dx: -1, dy: 0 },
        4: { dx: 1, dy: 0 },
        5: { dx: -1, dy: -1 },
        6: { dx: 1, dy: -1 },
        7: { dx: -1, dy: 1 },
        8: { dx: 1, dy: 1 },
    };

    return deltas[direction];
}


const put_words = () => {
    fillBoard(worded_board, false);
    for (let i = 0; i < words.length; i++) {
        let x = getRandomNumber(1, rows) - 1;
        let y = getRandomNumber(1, columns) - 1;
        let dir = getRandomNumberWeighted(1, 8, 200);
        let direction = getDirectionDelta(dir);
        let weight = 200;
        let trials = 0;
        while (true) {
            let valid = true
            let x_bound = x + (direction.dx * words[i].length)
            let y_bound = y + (direction.dy * words[i].length)
            // //console.log("params", x, y, direction.dx, direction.dy)
            // //console.log("bounds", x_bound, y_bound)
            // //console.log("direction", dir)



            if (x_bound < 0 || x_bound > rows) {
                valid = valid * 0;
                // //console.log("invalidx")
            }
            if (y_bound < 0 || y_bound > columns) {
                valid = valid * 0;
                // //console.log("invalidy")
            }
            if (valid) {
                for (j = 0; j < words[i].length; j++) {
                    // //console.log(
                    //     x + (direction.dx * j),
                    //     y + (direction.dy * j),
                    //     worded_board[x + (direction.dx * j)][y + (direction.dy * j)],
                    //     words[i][j]
                    // );
                    if (worded_board[x + (direction.dx * j)][y + (direction.dy * j)] != null) {
                        if (worded_board[x + (direction.dx * j)][y + (direction.dy * j)] == words[i][j]) {
                            //console.log("same letter, valid", words[i][j], x + (direction.dx * j), y + (direction.dy * j), words[i])
                            continue;
                        }
                        valid *= 0;
                        // //console.log("invalidl")
                    }
                }
            }
            // //console.log("valid", valid)
            if (valid) {
                break;
            }
            x = getRandomNumber(1, rows) - 1;
            y = getRandomNumber(1, columns) - 1;
            if (trials == 100) {
                dir = getRandomNumberWeighted(1, 8, weight);
                trials = 0;
            }
            trials++;
            direction = getDirectionDelta(dir);
            weight--;
        }

        for (j = 0; j < words[i].length; j++) {
            // //console.log(worded_board, x + (direction.dx * j), y + (direction.dy * j))
            worded_board[x + (direction.dx * j)][y + (direction.dy * j)] = words[i][j]
        }
    }
}


put_words();
//console.log(worded_board)

const fillGridRandom = (startPoint, square_size, columns, rows, random = true) => {
    context.font = "25px monospace";
    context.fillStyle = "#0f0e0d";
    context.textAlign = "center";
    context.textBaseline = "middle";

    if (random) {
        fillBoard(board)
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let letterPoint = new Point(
                startPoint.x + (j * square_size) + (square_size / 2),
                startPoint.y + (i * square_size) + (square_size / 2),
            )
            if (worded_board[i][j] != null) {
                context.fillText(worded_board[i][j].toUpperCase(), letterPoint.x, letterPoint.y);
            } else {
                context.fillText(board[i][j], letterPoint.x, letterPoint.y);
            }
        }
    }
}




drawTitle("Word Search", canvas.width / 2, 70);
drawTitle(words.join(" - "), canvas.width / 2, canvas.height - 50, 20);



drawGrid(startPoint, square_size, columns, rows)
fillGridRandom(startPoint, square_size, columns, rows)
// console.clear();
//console.log(words)


let highlights = [];

const highlight = (p1, p2, startPoint, square_size) => {
    let p1_point = getTransformedPoint(p1, startPoint, square_size)
    let p2_point = getTransformedPoint(p2, startPoint, square_size)

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTitle("Word Search", canvas.width / 2, 70);
    drawGrid(startPoint, square_size, columns, rows)
    fillGridRandom(startPoint, square_size, columns, rows, false)
    drawTitle(words.join(" - "), canvas.width / 2, canvas.height - 50, 20);
    drawTitle(Math.floor(timer).toString(), 50, 50, 40)

    drawLine(p1_point, p2_point)
    for (let i = 0; i < highlights.length; i++) {
        let hl = highlights[i]
        let hlstart = getTransformedPoint(hl[0], startPoint, square_size)
        let hlend = getTransformedPoint(hl[1], startPoint, square_size)
        drawLine(hlstart, hlend);
    }
}
const highlightCancel = (startPoint, square_size) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTitle("Word Search", canvas.width / 2, 70);
    drawGrid(startPoint, square_size, columns, rows)
    fillGridRandom(startPoint, square_size, columns, rows, false)
    drawTitle(words.join(" - "), canvas.width / 2, canvas.height - 50, 20);
    drawTitle(Math.floor(timer).toString(), 50, 50, 40)

    for (let i = 0; i < highlights.length; i++) {
        let hl = highlights[i]
        let hlstart = getTransformedPoint(hl[0], startPoint, square_size)
        let hlend = getTransformedPoint(hl[1], startPoint, square_size)
        drawLine(hlstart, hlend);
    }
}

const getTransformedPoint = (point, startPoint, square_size) => {
    let transformed = new Point(
        startPoint.x + (point.x * square_size) + square_size / 2,
        startPoint.y + (point.y * square_size) + square_size / 2,
    )
    return transformed
}

//highlight(new Point(1, 5), new Point(6, 0), startPoint, square_size)

let prevMousePops = new Point(0, 0);
let mousePos = new Point(0, 0);
let startPos = new Point(0, 0);
let endPos = new Point(0, 0);

let onHold = false;
let counting = false;


const drawTimer = () => {
    timer--;
    if (timer < 0) {
        timer = 0;
        if(highlights.length == 0){
            // window.reload();
        }
    }
    highlightCancel(startPoint, square_size);
}


// Function to get the mouse coordinates
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
}

canvas.addEventListener("mousemove", function (event) {
    const mpos = getMousePos(canvas, event);
    const x = mpos.x;
    const y = mpos.y;
    prevMousePops = mousePos;
    mousePos = new Point(x, y);
    if (onHold) {
        endPos = mousePos;

        endPos.x -= startPoint.x;
        endPos.x = Math.floor(endPos.x / square_size)
        endPos.y -= startPoint.y;
        endPos.y = Math.floor(endPos.y / square_size)
        highlight(startPos, endPos, startPoint, square_size)
    }
});

canvas.addEventListener("mousedown", function (event) {
    const mpos = getMousePos(canvas, event);
    const x = mpos.x;
    const y = mpos.y;
    mousePos = new Point(x, y);
    startPos = mousePos;
    startPos.x -= startPoint.x;
    startPos.x = Math.floor(startPos.x / square_size)
    startPos.y -= startPoint.y;
    startPos.y = Math.floor(startPos.y / square_size)
    onHold = true;

});

canvas.addEventListener("mouseup", function (event) {
    const mpos = getMousePos(canvas, event);
    const x = mpos.x;
    const y = mpos.y;
    onHold = false;
    mousePos = new Point(x, y);
    endPos = mousePos


    endPos.x -= startPoint.x;
    endPos.x = Math.floor(endPos.x / square_size)
    endPos.y -= startPoint.y;
    endPos.y = Math.floor(endPos.y / square_size)
    if (checkHighlightValid(startPos, endPos)) {
        highlight(startPos, endPos, startPoint, square_size)
        highlights.push([startPos.copy(), endPos.copy()])
    } else {
        highlightCancel(startPoint, square_size)
    }
    //console.log(highlights)
});

const checkHighlightValid = (p1, p2) => {
    let x = Math.abs(p1.x - p2.x);
    let y = Math.abs(p1.y - p2.y);

    if (x == 0 || y == 0) {
        return true;
    }

    if (x == y) {
        return true;
    }

    return false;

}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
        if (highlights.length > 0) {
            highlights.pop();
            highlightCancel(startPoint, square_size);
        }
    }
});

drawTimer();
setInterval(drawTimer, 1000);