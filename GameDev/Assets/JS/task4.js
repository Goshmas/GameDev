const INITIAL_LIST_NAME = "initial-list";
const TARGET_LIST_NAME = "target-list";

const words = [];

const targetList = document.querySelector("[data-list='target-list']");
const initialList = document.querySelector("[data-list='initial-list']");
const headerForm = document.querySelector(".header-form");
const inputContainer = document.querySelector(".form");
const wordsContainer = document.getElementById("words-container");

const form = document.querySelector("form");

// Обработчики событий
targetList.addEventListener("dragover", dragOverTargetList);
targetList.addEventListener("drop", dropToTargetList);
form.addEventListener("submit", handleSubmit);
headerForm.addEventListener("dragover", dragOverHeaderForm);
headerForm.addEventListener("drop", dropToHeaderForm);

// Обработчик клика на элементы в left-list
targetList.addEventListener("click", (event) => {
    if (event.target.classList.contains("word-block")) {
        moveWordUnderInput(event.target);
    }
});

// Функция для обработки отправки формы
function handleSubmit(event) {
    event.preventDefault();

    resetBoard();

    const inputElement = document.querySelector("input");
    const value = inputElement.value;

    const splittedValues = value.split("-").map((word) => word.trim());

    const words = splittedValues.filter((value) => isNaN(value)).sort();
    const numbers = splittedValues
        .filter((value) => !isNaN(value))
        .sort((a, b) => a - b);

    const result = [
        ...words.map((word, index) => ({ [`a${index + 1}`]: word })),
        ...numbers.map((number, index) => ({ [`n${index + 1}`]: number })),
    ];

    addWordsToHeader(result);
}

// Добавление слов в header-form
function addWordsToHeader(wordsObjects) {
    headerForm.innerHTML = "";
    wordsObjects.forEach((wordObj) => {
        const [key] = Object.keys(wordObj);
        const value = wordObj[key];

        if (value.length > 0) {
            const wordElement = createOvalElement(value);
            headerForm.appendChild(wordElement);
        }
    });
}

// Создание овального элемента
function createOvalElement(value) {
    const ovalElement = document.createElement("div");
    ovalElement.className = "oval-element";
    ovalElement.textContent = value;
    ovalElement.draggable = true;

    ovalElement.addEventListener("dragstart", startDraggingBlock);
    ovalElement.addEventListener("dragend", stopDraggingBlock);

    return ovalElement;
}

// Обработка перетаскивания в left-list
function dragOverTargetList(event) {
    event.preventDefault();
}

function dropToTargetList(event) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");
    if (!data) return;

    // Проверяем, существует ли уже такой элемент в left-list
    const isDuplicate = Array.from(targetList.children).some(
        (child) => child.textContent === data
    );

    if (isDuplicate) {
        // Если элемент уже есть в списке, удаляем его
        const draggingElement = document.querySelector(".oval-element.dragging");
        if (draggingElement) {
            draggingElement.remove();
        }
        return;
    }

    // Создаем новый элемент для left-list
    const newElement = document.createElement("li");
    newElement.className = "word-block";
    newElement.textContent = data;
    newElement.draggable = true;

    // Применяем овальную форму и случайный цвет
    newElement.style.backgroundColor = getRandomColor();

    newElement.addEventListener("dragstart", startDraggingBlock);
    newElement.addEventListener("dragend", stopDraggingBlock);

    // Добавляем обработчик клика для удаления и перемещения под input
    newElement.addEventListener("click", () => {
        moveWordUnderInput(newElement);
    });

    // Добавляем новый элемент в left-list
    targetList.appendChild(newElement);

    // Удаляем оригинальный элемент из header-form
    const draggingElement = document.querySelector(".oval-element.dragging");
    if (draggingElement) {
        draggingElement.remove();
    }
}

// Функция для перемещения слова под input
targetList.addEventListener("click", (event) => {
    if (event.target.classList.contains("word-block")) {
        moveWordUnderInput(event.target);
    }
});

// Функция для перемещения слова под input
function moveWordUnderInput(wordElement) {
    // Проверяем, что слово еще не было перемещено
    if (!wordElement.classList.contains("moved")) {
        // Удаляем слово из left-list
        wordElement.remove();

        // Создаем новый элемент для отображения под input
        const newElement = document.createElement("div");
        newElement.className = "word-under-input";
        newElement.textContent = wordElement.textContent;

        // Получаем цвет фона из left-list и применяем его как цвет текста
        const backgroundColor = wordElement.style.backgroundColor;
        newElement.style.color = backgroundColor;

        // Добавляем элемент в контейнер под input
        wordsContainer.appendChild(newElement);

        // Помечаем слово как перемещенное
        wordElement.classList.add("moved");
    }
}

// Обработка перетаскивания в header-form
function dragOverHeaderForm(event) {
    event.preventDefault();
}

function dropToHeaderForm(event) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");
    if (!data) return;

    // Удаляем оригинальный элемент из left-list
    const draggingElement = document.querySelector(".word-block.dragging");
    if (draggingElement) {
        draggingElement.remove();
    }

    // Получаем текущие слова из header-form
    const currentWords = Array.from(headerForm.children).map(
        (element) => element.textContent
    );

    // Добавляем новое слово в массив
    currentWords.push(data);

    // Сортируем слова
    const words = currentWords.filter((value) => isNaN(value)).sort();
    const numbers = currentWords
        .filter((value) => !isNaN(value))
        .sort((a, b) => a - b);

    const result = [
        ...words.map((word, index) => ({ [`a${index + 1}`]: word })),
        ...numbers.map((number, index) => ({ [`n${index + 1}`]: number })),
    ];

    // Обновляем header-form с отсортированными словами
    addWordsToHeader(result);
}

// Логика для перетаскивания блоков
function startDraggingBlock(event) {
    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.target.classList.add("dragging");
}

function stopDraggingBlock(event) {
    event.target.classList.remove("dragging");
}

// Очистка страницы
function resetBoard() {
    headerForm.innerHTML = "";
    targetList.innerHTML = "";
    initialList.innerHTML = "";
    wordsContainer.innerHTML = "";
}

// Функция для генерации случайного цвета
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}