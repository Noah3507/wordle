# Wordle Game

이 프로젝트는 HTML, CSS, JavaScript를 이용해 구현한 Wordle 게임입니다.

### 폴더 구조

- **index.html:** 게임 인터페이스를 구성하는 HTML 파일 (루트 폴더에 위치)
- **src/style.css:** 게임판, 가상 키보드, 애니메이션 등 전체 스타일을 정의합니다.
- **src/index.js:** 게임 로직(보드 생성, 키 입력 처리, 단어 평가 등)을 포함합니다.
- **src/dictionary.js:** 게임에 사용되는 단어 목록을 저장합니다.


### 요구사항

1. 기본 UI 구성

게임 화면에 5x6 격자(word grid)를 생성 [o]

키보드 입력을 받거나 가상 키보드(화면 UI) 제공 [o]

사용자가 입력한 단어를 표시 [o]

2. 게임 로직 구현

정답 단어(5글자)를 설정 [o]

사용자가 입력한 단어와 정답을 비교하여 글자 색상 변경 [o]

6번 시도 후 정답을 맞히지 못하면 게임 종료 및 재시작 [o]

3. 추가 기능

단어 입력 유효성 검사 (실제 단어인지 확인) [o]

게임 시작/재시작 버튼 [x]

애니메이션 효과 추가 [o]



### 실행 방법

Wordle 게임은 ES6 모듈(import/export)을 사용하므로, 파일 시스템(file://)에서 직접 열면 제대로 동작하지 않을 수 있습니다.. 따라서 로컬 HTTP 서버를 통해 실행해야 합니다.

### 방법 : VS Code의 Go Live 또는 Live Server 확장 프로그램 사용

1. VS Code에서 이 프로젝트 폴더(ex. `wordle`)를 엽니다.
2. VS Code 우측 하단의 **"Go Live"** 버튼을 클릭하거나, Command Palette(`Ctrl+Shift+P`)에서 **"Live Server: Open with Live Server"** 를 선택합니다.
3. 기본 웹 브라우저가 자동으로 열리며, 예를 들어 `http://127.0.0.1:5500` 주소에서 Wordle 게임이 실행됩니다.


### 추가 참고 사항

파일 직접 열기 주의:
단순히 index.html 파일을 파일 탐색기에서 더블클릭하여 실행하면 모듈 로딩 문제로 인해 게임 로직이 동작하지 않을 수 있습니다. 반드시 로컬 서버를 통해 실행하여 주세요..

개발자 도구 사용:
게임 실행 시, 개발자 도구 콘솔에서 정답 단어를 확인할 수 있습니다.

단어 리스트 출처:
이 게임에서 사용된 단어 목록은 'https://github.com/charlesreid1/five-letter-words' 저장소에서 가져왔습니다.

