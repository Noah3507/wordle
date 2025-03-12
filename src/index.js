import { realDictionary } from "./dictionary.js";

// 단어들을 소문자로 통일 (일관성 있게 비교)
const dictionary = realDictionary.map(word => word.toLowerCase());

const state = {
  answer: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6).fill().map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};


// ───────────────── 보드 생성 함수 (기존 drawGrid() 대체) ─────────────────
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

// ───────────────── 가상 키보드 생성 함수 ─────────────────
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
  
  // 추가 행: Enter와 Backspace
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

// ───────────────── 물리 키보드 이벤트 등록 ─────────────────
function registerKeyboardEvents() {
  document.addEventListener("keydown", (e) => {
    onKeyDown(e.key);
  });
}

// ───────────────── 헬퍼 함수들 ─────────────────
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

// ───────────────── 단어 평가 및 보드/키 업데이트 (flip 애니메이션 복원) ─────────────────
function revealWord(guess) {
  const rowIndex = state.currentRow;
  const animationDuration = 500; // ms

  // 정답 단어의 각 글자 개수 계산 (복사본)
  const answerCount = {};
  for (let i = 0; i < state.answer.length; i++) {
    const letter = state.answer[i];
    answerCount[letter] = (answerCount[letter] || 0) + 1;
  }

  // 결과 상태 배열 초기화 (각 칸의 상태)
  const statusArray = Array(5).fill("none");

  // 1단계: 정확한 위치의 글자("valid") 처리
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (letter === state.answer[i]) {
      statusArray[i] = "valid";
      answerCount[letter]--; // 해당 글자의 남은 개수 감소
    }
  }

  // 2단계: 위치는 다르지만 포함되어 있는 글자("invalid") 처리
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (statusArray[i] !== "valid") {
      if (state.answer.includes(letter) && answerCount[letter] > 0) {
        statusArray[i] = "invalid";
        answerCount[letter]--;
      }
    }
  }

  // 애니메이션과 상태 업데이트 적용
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

  // 승리 및 패배 조건 체크
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

// ───────────────── 키 입력 처리 함수 ─────────────────
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

// ───────────────── 게임 재시작 함수 ─────────────────
function restartGame() {
  state.answer = dictionary[Math.floor(Math.random() * dictionary.length)];
  state.grid = Array(6).fill().map(() => Array(5).fill(""));
  state.currentRow = 0;
  state.currentCol = 0;
  generateBoard();
  createKeyboard();
}

// ───────────────── 초기화 함수 ─────────────────
function startup() {
  console.log("정답 단어:", state.answer); //테스트용
  generateBoard();
  createKeyboard();
  registerKeyboardEvents();
}

startup();
