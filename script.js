// JavaScript

// Default values
let previousVal = ''
let currentVal = '0'
let sumVal = ''
let currentOperator = null
let forceSum = false

// DOM nodes
const displayPrevious = document.querySelector('.display .previous')    // partial complete - tidyDisplay() on any displayed values required
const displayCurrent = document.querySelector('.display .current')      // partial complete - tidyDisplay() on any displayed values required

const keyBtns = document.querySelectorAll('button.key')                 // complete
const operatorBtns = document.querySelectorAll('button.operator')       // complete
const modifierBtns = document.querySelectorAll('button.modifier')       // complete
const equalBtn = document.getElementById('equals')                      // complete

// Event listeners
keyBtns.forEach(key => { 
    const value = key.id
    key.addEventListener('click', () => appendKey(value))
})

operatorBtns.forEach(operator => {
    const value = operator.id
    operator.addEventListener('click', () => setOperation(value))
})

modifierBtns.forEach(modifier => {
    const value = modifier.id
    modifier.addEventListener('click', () => modifyDisplay(value))
})

equalBtn.addEventListener('click', () => {
    forceSum = true
    controller()
})


// Program functions
function appendKey(value) {
    if (value == '.' && currentVal.includes('.')) return
    if (sumVal !== '') {            // enables fresh calculation if sum has been produced via '=' (via forceSum)
        console.log("triggered")
        currentVal = value
        sumVal = ''
    } else if ((value == '.' && currentVal == '0') || currentVal !== '0') {
        currentVal += value
    } else currentVal = value
    updateDisplay()
}

function modifyDisplay(value) {
    if (value == 'clear-entry') { 
        if (previousVal !== '') {   // clears currentDisplay only, unless a result has been printed (previousVal == '')
            resetCurrentDisplay()
        } else clearDisplay()
    } else if (value == 'clear') {
        clearDisplay()
    } else if (value == 'backspace') {
        currentVal = currentVal.slice(0, -1)
        if (currentVal == '') {
            currentVal = '0'
        }
        updateDisplay()
    } else {
        currentVal = 'ERR'
        updateDisplay()
    }
}

function getSymbol(operator) {
    switch (operator) {
        case 'percentage':
            return '%'

        case 'power':
            return '^'

        case 'root':
            return '√'

        case 'factorial':
            return '!'

        case 'divide':
            return '÷'

        case 'multiply':
            return '×'

        case 'plus':
            return '+'

        case 'minus':
            return '-'
    }
}

function setOperation(value) {
    // allows change of symbol before new value is entered
    if (previousVal !== '' && currentOperator !== null && currentVal == '0') {
        if (value == 'root' || value == 'factorial') return
        currentOperator = value
        updateDisplay()
        return
    }

    // prevents operator being set before any value is entered   TODO: not needed if value is default '0', as calculations can be performed with 0
    if (currentVal == '') return

    // calculate current sum before considering new operations
    if (currentOperator !== null) controller()

    // filter out invalid operations
    if (currentVal == 'Invalid Input' || currentVal == 'NaN' || currentVal == 'undefined') {
        updateDisplay()
        currentVal = ''
        return
    }
    currentOperator = value

    // forces sum calculation of root and factorial operators
    if (currentOperator == 'root' || currentOperator == 'factorial') {
        forceSum = true
        controller()
        return  
    } else {
    previousVal = currentVal
    currentVal = '0'
    updateDisplay()
    }
}

function controller() {
    // prevents any abuse and/or updateDisplay() bugs
    if (currentVal == '' || currentOperator == null) return forceSum = false

    // prints out full calculation along with the result if '=' is pressed
    if (forceSum == true) {
        sumVal = compute(currentOperator, previousVal, currentVal)
        updateDisplay()
        previousVal = ''
        currentVal = sumVal
        currentOperator = null
        forceSum = false
        return
    }

    // calculates current sum before considering new operations
    sumVal = compute(currentOperator, previousVal, currentVal)
    currentVal = sumVal
    sumVal = ''
    previousVal = ''
    currentOperator = null
}

function compute(operator, a, b) {
    a = parseFloat(a)
    b = parseFloat(b)

    switch(operator) {
        case 'percentage':
            return (a / 100) * b                                        // 'a'% of 'b'

        case 'power':
            return Math.pow(a, b)

        case 'root':
            if (b < 0) return 'Invalid Input'                           // rejects non-positive values
            else return Math.sqrt(b)

        case 'factorial':
            if (b < 0 || !Number.isInteger(b))  return 'Invalid Input'  // only accepts positive integers
            else return factorial(b)

        case 'divide':
            if (b == 0) {
                return 'Invalid Input'                                  // rejects divison by 0
            } else return a / b

        case 'multiply':
            return a * b

        case 'plus':
            return a + b

        case 'minus':
            return a - b

        default:
            return
    }
}

function factorial(b) {
    let result = 1
    for (let i = 2; i <= b; i++) {
        result = (result * i)
    }
    return result
}

function updateDisplay() {
    
    console.log("current operator: " + currentOperator)
    console.log("prev: " + previousVal)
    console.log("curr: " + currentVal)
    console.log("sum: " + sumVal)
    console.log("------------------------")
    
    //TODO: add tidyDisplay() function to 'previousVal' outputs and limit the number of values + decimals
    // prints out full calculation along with the result if 'forceSum' is true
    if (forceSum == true) {
        switch(currentOperator) {
            case 'percentage':
                displayPrevious.textContent = `${previousVal}${getSymbol(currentOperator)} ${getSymbol('multiply')} ${currentVal} =`
                displayCurrent.textContent = sumVal
                break

            case 'root':
                displayPrevious.textContent = `${getSymbol(currentOperator)}${currentVal} =`
                displayCurrent.textContent = sumVal
                break

            case 'factorial':
                displayPrevious.textContent = `${currentVal}${getSymbol(currentOperator)} =`
                displayCurrent.textContent = sumVal
                break
            
            default:
                console.log("display activation here")
                displayPrevious.textContent = `${previousVal} ${getSymbol(currentOperator)} ${currentVal} =`
                displayCurrent.textContent = sumVal
        }
        return
    }

    // displays continuation of calculation if additional operators are selected
    if (currentOperator !== null) {
        switch(currentOperator) {
            case 'percentage':
                displayPrevious.textContent = `${previousVal}${getSymbol(currentOperator)} ${getSymbol('multiply')}`
                break

            default:
                displayPrevious.textContent = `${previousVal} ${getSymbol(currentOperator)}`
                break
        }
        
    } else displayPrevious.textContent = previousVal

    //TODO: add tidyDisplay() function to 'currentVal' outputs and limit the number of values
    // displays currentVal
    displayCurrent.textContent = currentVal
}

function clearDisplay() {
    previousVal = ''
    currentVal = '0'
    sumVal = ''
    currentOperator = null
    forceSum = false
    updateDisplay()

}

function resetCurrentDisplay() {
    currentVal = '0'
    updateDisplay()
}

function tidyDisplay() {

}
