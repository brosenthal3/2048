const game = (function(){
    const gridDisplay = document.querySelector('.grid');
    const resultDisplay = document.querySelector('.result');
    const gridCount = 4;
    const squaresArray = [];

    const createBoard = () => {
        for (let i = 0; i < gridCount*gridCount; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.innerHTML = '';
            gridDisplay.appendChild(square);
            squaresArray.push(square);
        }
        generateNum();
        generateNum();
    }
    const generateNum = () => {
        let empty = 0;
        squaresArray.forEach((square) => {
            if(square.innerHTML == ''){
                empty++;
            }
        });
        if(empty == 0){
            return;
        }
        randomNum = Math.floor(Math.random() * squaresArray.length);
        if(squaresArray[randomNum].innerHTML.length < 1){
            squaresArray[randomNum].innerHTML = 2;
        }else{
            generateNum();
        }
        applyStyles();   
    }

    const getRows = () => {
        const rows = [];
        const filteredRows = [];
        for (let i = 0; i < gridCount*gridCount; i++) {
            if(i % 4 == 0){
                const row = [
                    +squaresArray[i].innerHTML,
                    +squaresArray[i+1].innerHTML,
                    +squaresArray[i+2].innerHTML,
                    +squaresArray[i+3].innerHTML,
                ];
                rows.push(row);
                filteredRows.push(row.filter(num => num));
            }
        }
        return {
            rows,
            filteredRows
        };
    }
    const getColumns = () => {
        const columns = [];
        const filteredColumns = [];
        for (let i = 0; i < gridCount; i++) {
            const column = [
                +squaresArray[i].innerHTML,
                +squaresArray[i+4].innerHTML,
                +squaresArray[i+8].innerHTML,
                +squaresArray[i+12].innerHTML,
            ];
            columns.push(column);
            filteredColumns.push(column.filter(num => num));
        }
        return {
            columns,
            filteredColumns
        };
    }
    const getScore = () => {
        const score = squaresArray.reduce((total, square) => {
            return total + +square.innerHTML;
        }, 0);
        return score;
    }

    const determineEnd = () => {
        if(getScore() >= 2048){
            endGame('win');
            return;
        }
        let empty = 0;
        squaresArray.forEach((square) => {
            if(square.innerHTML == ''){
                empty++;
            }
        });
        if(empty == 0){
            endGame('lose');
            return;
        }
        return;
    }
    const endGame = (outcome) => {
        document.removeEventListener('keypress', keyPress);
        gridDisplay.style.opacity = '0.2';
        resultDisplay.innerHTML = `You ${outcome} <br> <span>Your score: ${getScore()}</span>`;
    }
    

    const move = (direction) => {
        if(direction == 'right' || direction == 'left'){
            const rows = getRows().rows;
            const filteredRows = getRows().filteredRows;

            rows.forEach((row, i) => {
                const missing = 4 - filteredRows[i].length;
                let newRow = new Array;
                if(direction == 'right'){
                    newRow = Array(missing).fill('').concat(filteredRows[i]);
                } else if(direction == 'left'){
                    newRow = filteredRows[i].concat(Array(missing).fill(''));
                }
                row.forEach((square, rowI) => {
                    squaresArray[rowI + 4*i].innerHTML = newRow[rowI];
                })
            });
        }else if(direction == 'down' || direction == 'up'){
            const columns = getColumns().columns;
            const filteredColumns = getColumns().filteredColumns;

            columns.forEach((column, i) => {
                const missing = 4 - filteredColumns[i].length;
                let newColumn = new Array;
                if(direction == 'up'){
                    newColumn = filteredColumns[i].concat(Array(missing).fill(''));
                }else if(direction == 'down'){
                    newColumn = Array(missing).fill('').concat(filteredColumns[i]);
                }
                column.forEach((square, columnI) => {
                    squaresArray[columnI*4 + i].innerHTML = newColumn[columnI];
                });
            });
        }
    }
    
    const combine = (direction) => {
        if(direction == 'horizontal'){
            const rows = getRows().rows;
            rows.forEach((row, i) => {
                row.forEach((square, rowI) => {
                    if(row[rowI] == row[rowI + 1] && row[rowI] != 0){
                        squaresArray[rowI + 4*i + 1].innerHTML = row[rowI] + row[rowI +1];
                        squaresArray[rowI + 4*i].innerHTML = '';
                    }
                });
            });    
        }else if(direction == 'vertical'){
            const columns = getColumns().columns;
            columns.forEach((column, i) => {
                column.forEach((square, columnI) => {
                    if(column[columnI] == column[columnI + 1] && column[columnI] != 0){
                        squaresArray[columnI*4 + i + 4].innerHTML = column[columnI] + column[columnI +1];
                        squaresArray[columnI*4 + i].innerHTML = '';
                    }
                });
            });
        }
    }

    const keyPress = (e) => {
        const key = e.keyCode;
        switch (key) {
            case 100:
                move('right');
                combine('horizontal');
                move('right');
                break;
            case 97:
                move('left');
                combine('horizontal');
                move('left');
                break;
            case 115:
                move('down');
                combine('vertical');
                move('down');
                break;
            case 119: 
                move('up');
                combine('vertical');
                move('up');
                break;

            default:
                return;
        }
        determineEnd();
        generateNum();
    }

   

    const applyStyles = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach((square, i) => {
            let bg = '';
            let color = '#776E65';
            switch(square.innerHTML){
                case '':
                    bg = '#CDC0B4';
                    break;
                case '2':
                    bg = '#EEE4DA';
                    break;
                case '4':
                    bg = '#EDE0C8';
                    break;
                case '8':
                    bg = '#F2B38C';
                    break;
                case '16':
                    bg = '#F59563';
                    color = '#F9F6F2';
                    break;
                case '32':
                    bg = '#F57C5F';
                    color = '#F9F6F2';
                    break;
                case '64':
                    bg = '#EB5738';
                    color = '#F9F6F2';
                    break;
                default:
                    bg = '#3C3A32';
                    color = '#F9F6F2';
                    break;
            }
            squaresArray[i].style.backgroundColor = bg;
            squaresArray[i].style.color = color;
        });
    }
    
    document.addEventListener('keypress', keyPress);
    document.getElementById('new-game').addEventListener('click', () => window.location.reload());
    createBoard();
})();
