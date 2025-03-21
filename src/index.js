import { realDictionary } from "./dictionary.js";

const dictionary = realDictionary.map(word => word.toLowerCase());

const state = {
  answer: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6).fill().map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};


function generateBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const rowEl = document.createElement("ul");
    rowEl.setAttribute("data-row", i);
    for (let j = 0; j < 5; j++) {
      const box = document.createElement("li");
      box.className = "box";
      box.setAttribute("data-status", "empty");
      box.id = `box${i}${j}`;
      box.textContent = "";
      rowEl.appendChild(box);
    }
    board.appendChild(rowEl);
  }
}

function createKeyboard() {
  const keyboardContainer = document.getElementById("keyboard");
  keyboardContainer.innerHTML = "";
  const keyRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  
  keyRows.forEach(row => {
    const ul = document.createElement("ul");
    row.split("").forEach(char => {
      const li = document.createElement("li");
      li.textContent = char;
      li.setAttribute("data-key", char);
      li.setAttribute("data-status", "");
      li.addEventListener("click", () => onKeyDown(char));
      ul.appendChild(li);
    });
    keyboardContainer.appendChild(ul);
  });
  
 
  const extraRow = document.createElement("ul");
  
  const enterKey = document.createElement("li");
  enterKey.textContent = "Enter";
  enterKey.setAttribute("data-key", "Enter");
  enterKey.addEventListener("click", () => onKeyDown("Enter"));
  extraRow.appendChild(enterKey);
  
  const backspaceKey = document.createElement("li");
  backspaceKey.textContent = "Backspace";
  backspaceKey.setAttribute("data-key", "Backspace");
  backspaceKey.addEventListener("click", () => onKeyDown("Backspace"));
  extraRow.appendChild(backspaceKey);
  
  keyboardContainer.appendChild(extraRow);
}


function registerKeyboardEvents() {
  document.addEventListener("keydown", (e) => {
    onKeyDown(e.key);
  });
}


function isLetter(key) {
  return key.length === 1 && /[a-zA-Z]/.test(key);
}

function addLetter(letter) {
  if (state.currentCol >= 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol <= 0) return;
  state.currentCol--;
  state.grid[state.currentRow][state.currentCol] = "";
}

function getCurrentWord() {
  return state.grid[state.currentRow].join("");
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      if (box) {
        box.textContent = state.grid[i][j];
      }
    }
  }
}


function revealWord(guess) {
  const rowIndex = state.currentRow;
  const animationDuration = 500; // ms

  
  const answerCount = {};
  for (let i = 0; i < state.answer.length; i++) {
    const letter = state.answer[i];
    answerCount[letter] = (answerCount[letter] || 0) + 1;
  }

  
  const statusArray = Array(5).fill("none");

  
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (letter === state.answer[i]) {
      statusArray[i] = "valid";
      answerCount[letter]--; 
    }
  }

  
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (statusArray[i] !== "valid") {
      if (state.answer.includes(letter) && answerCount[letter] > 0) {
        statusArray[i] = "invalid";
        answerCount[letter]--;
      }
    }
  }

  
  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${rowIndex}${i}`);
    box.classList.add("animated");
    box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
    setTimeout(() => {
      const letter = guess[i];
      box.setAttribute("data-status", statusArray[i]);
      updateKeyboardKey(letter, statusArray[i]);
    }, ((i + 1) * animationDuration) / 2);
  }

  
  if (state.answer === guess) {
    setTimeout(() => {
      alert("🎉 정답입니다! 게임을 다시 시작합니다.");
      restartGame();
    }, 1500);
  } else if (state.currentRow === 5) {
    setTimeout(() => {
      alert(`❌ 다음 기회에.. 정답은 ${state.answer}. 게임을 다시 시작합니다.`);
      restartGame();
    }, 1500);
  }
}


function updateKeyboardKey(letter, status) {
  const keyEl = document.querySelector(`[data-key="${letter.toUpperCase()}"]`);
  if (!keyEl) return;
  const currentStatus = keyEl.getAttribute("data-status");
  if (currentStatus === "valid") return;
  if (status === "valid" || (status === "invalid" && currentStatus !== "valid")) {
    keyEl.setAttribute("data-status", status);
  } else if (!currentStatus) {
    keyEl.setAttribute("data-status", status);
  }
}


function onKeyDown(key) {
  if (state.currentRow >= 6) return;
  
  if (key === "Enter") {
    if (state.currentCol < 5) {
      alert("단어가 완성되지 않았습니다.");
      return;
    }
    const word = getCurrentWord().toLowerCase();
    if (!dictionary.includes(word)) {
      alert("올바른 단어가 아닙니다.");
      return;
    }
    revealWord(word);
    state.currentRow++;
    state.currentCol = 0;
  } else if (key === "Backspace") {
    removeLetter();
  } else if (isLetter(key)) {
    addLetter(key);
  }
  updateGrid();
}


function restartGame() {
  state.answer = dictionary[Math.floor(Math.random() * dictionary.length)];
  state.grid = Array(6).fill().map(() => Array(5).fill(""));
  state.currentRow = 0;
  state.currentCol = 0;
  generateBoard();
  createKeyboard();
  console.log("정답 단어:", state.answer); //테스트용
}


function startup() {
  console.log("정답 단어:", state.answer); //테스트용
  generateBoard();
  createKeyboard();
  registerKeyboardEvents();
}

startup();
