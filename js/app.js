let currentInput = document.querySelector('.currentInput');
let answerScreen = document.querySelector('.answerScreen');
let buttons = document.querySelectorAll('button');
let erasebtn = document.querySelector('#erase');
let clearbtn = document.querySelector('#clear');
let evaluate = document.querySelector('#evaluate');


let realTimeScreenValue = [];

const calculate = (expression) => {
    let numbers = [];
    let operators = [];
    let currentNum = '';

    const precedence = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/' ) return 2;
        return 0;
    };

    const applyOperator = () => {
        let b = numbers.pop();
        let a = numbers.pop();
        let operator = operators.pop();

        if (a === undefined || b === undefined) return;

        switch (operator) {
            case '+':
                numbers.push(a + b);
                break;
            case '-':
                numbers.push(a - b);
                break;
            case '*':
                numbers.push(a * b);
                break;
            case '/':
                if (b === 0) {
                    numbers = ["Error"];
                    return;
                }
                numbers.push(a / b);
                break;
            default:
                break;
        }
    };

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        if (/\d/.test(char) || char === '.') {
            currentNum += char;
        } 
        else if (['+', '-', '*', '/', '%'].includes(char)) {
            if (currentNum) {
                let num = parseFloat(currentNum);

                if (char === '%') {
                    let lastOp = operators[operators.length - 1];

                    if (lastOp === '+' || lastOp === '-') {
                        num = (numbers[numbers.length - 1] * num) / 100;
                    } else if (lastOp === '*' || lastOp === '/') {
                        num = num / 100;
                    } else {
                        num = num / 100; 
                    }

                    numbers.push(num);
                    currentNum = '';
                    continue; 
                }

                numbers.push(num);
                currentNum = '';
            }

            while (
                operators.length > 0 &&
                precedence(operators[operators.length - 1]) >= precedence(char)
            ) {
                applyOperator();
            }

            operators.push(char);
        }
    }

    if (currentNum) {
        numbers.push(parseFloat(currentNum));
    }

    while (operators.length > 0) {
        applyOperator();
    }

    return numbers[0];
};

const precedence = (op) => {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
};


clearbtn.addEventListener("click", () => {
    realTimeScreenValue = [];
    currentInput.innerHTML = '';
    answerScreen.innerHTML = '0';
});


erasebtn.addEventListener("click", () => {
    realTimeScreenValue.pop();
    currentInput.innerHTML = realTimeScreenValue.join('');
    
    if (realTimeScreenValue.length > 0) {
        answerScreen.innerHTML = calculate(realTimeScreenValue.join(''));
    } else {
        answerScreen.innerHTML = '0';
    }
});

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.id !== 'erase' && btn.id !== 'evaluate') {
            realTimeScreenValue.push(btn.value); 
            currentInput.innerHTML = realTimeScreenValue.join(''); 
            answerScreen.innerHTML = calculate(realTimeScreenValue.join(''));
        }
    });
});

evaluate.addEventListener("click", () => {
    let expression = realTimeScreenValue.join(''); 
    let result = calculate(expression); 
    answerScreen.innerHTML = result; 
});
