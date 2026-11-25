
const screen = document.getElementById("screen");
const previous = document.getElementById("previous");

let current = "0";
let stored = null;
let operator = null;
let resetNext = false;

function render() {
  screen.textContent = current;
}

function format(value) {
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(12)));
}

function calculate() {
  if (stored === null || operator === null) return;

  const a = stored;
  const b = Number(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        current = "Error";
        stored = null;
        operator = null;
        previous.textContent = "";
        resetNext = true;
        render();
        return;
      }
      result = a / b;
      break;
  }

  previous.textContent = "";
  current = format(result);
  stored = null;
  operator = null;
  resetNext = true;
  render();
}

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") {
    current = "0";
    stored = null;
    operator = null;
    previous.textContent = "";
    resetNext = false;
  }

  else if (action === "delete") {
    if (resetNext || current === "Error") {
      current = "0";
      resetNext = false;
    } else {
      current = current.length > 1 ? current.slice(0, -1) : "0";
      if (current === "-") current = "0";
    }
  }

  else if (action === "sign" && current !== "0" && current !== "Error") {
    current = String(-Number(current));
  }

  else if (action === "percent" && current !== "Error") {
    current = format(Number(current) / 100);
  }

  else if (value !== undefined) {
    if (current === "Error") current = "0";

    if ("+-*/".includes(value)) {
      if (operator && !resetNext) calculate();

      stored = Number(current);
      operator = value;
      previous.textContent = current + " " + value;
      resetNext = true;
    }

    else if (value === ".") {
      if (resetNext) {
        current = "0.";
        resetNext = false;
      } else if (!current.includes(".")) {
        current += ".";
      }
    }

    else {
      if (resetNext || current === "0") {
        current = value;
        resetNext = false;
      } else if (current.replace("-", "").length < 15) {
        current += value;
      }
    }
  }

  else if (action === "calculate") {
    calculate();
  }

  render();
});

render();
