const data = [
  {
      id: "1",
      isCompleted: false,
      question: "Если человека назвали мордофиля, то это…",
      answers: [
          {
              id: "1",
              isCorrect: true,
              text: "Значит, что он тщеславный.",
              description:
                  "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный.",
          },
          {
              id: "2",
              isCorrect: false,
              text: "Значит, что у него лицо как у хряка.",
          },
          {
              id: "3",
              isCorrect: false,
              text: "Значит, что чумазый.",
          },
      ],
  },
  {
      id: "2",
      isCompleted: false,
      question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
      answers: [
          {
              id: "4",
              isCorrect: true,
              text: "Он маленький и невзрачный.",
              description:
                  "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи.",
          },
          {
              id: "5",
              isCorrect: false,
              text: "Он тот еще алкоголик.",
          },
          {
              id: "6",
              isCorrect: false,
              text: "Он не держит свое слово.",
          },
      ],
  },
  {
      id: "3",
      isCompleted: false,
      question: "Если человека прозвали пятигузом, значит, он…",
      answers: [
          {
              id: "7",
              isCorrect: true,
              text: "Не держит слово",
              description:
                  "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек.",
          },
          {
              id: "8",
              isCorrect: false,
              text: "Изменяет жене.",
          },
          {
              id: "9",
              isCorrect: false,
              text: "Без гроша в кармане.",
          },
      ],
  },
  {
      id: "4",
      isCompleted: false,
      question: "Кто такой шлындра?",
      answers: [
          {
              id: "10",
              isCorrect: false,
              text: "Обманщик.",
          },
          {
              id: "11",
              isCorrect: false,
              text: "Нытик.",
          },
          {
              id: "12",
              isCorrect: true,
              text: "Бродяга.",
              description:
                  "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться.",
          },
      ],
  },
];

const questions = [...data];

let score = 0;

const questionsContainer = document.querySelector(".questions-list");
const answersContainer = document.querySelector(".answers-list");
const contentWrapper = document.querySelector(".content-wrapper");

appendQuestion(getRandomQuestion());

questionsContainer.addEventListener("click", (event) => {
  const questionElement = event.target.closest(".questions-list__item");

  if (questionElement) {
      const questionId = questionElement.dataset.question;

      if (questions.length > 0) {
          const question = getQuestionById(questionId);
          if (!question.isCompleted) {
              appendAnswers(question.answers, questionId);
          }
      } else {
          showCorrectAnswer(questionId);
      }
  }
});

answersContainer.addEventListener("click", (event) => {
  const answerElement = event.target.closest(".answers-list__item");

  if (answerElement) {
      const answerId = answerElement.dataset.answer;
      const answerObject = getAnswerById(answerId);

      disableAnswers();

      if (answerObject.isCorrect) {
          const descriptionElement = `
              <p class="description">
                  ${answerObject.description}
              </p>
          `;

          const descriptionContainer = answerElement.querySelector("div");
          descriptionContainer.innerHTML += descriptionElement;

          const questionId = answerElement.dataset.question;
          markQuestion(questionId, true);
          score += 1;

          removeIncorrectAnswers(answerId);
          setTimeout(() => {
              answerElement.classList.add("answers-list__item--remove");
              removeQuestionById(questionId);
              setTimeout(() => {
                  clearAnswersContainer();
                  if (questions.length > 0) {
                      appendQuestion(getRandomQuestion());
                  } else {
                      showEmptyMessage();
                      showResults();
                  }
              }, 1500);
          }, 6000);
      } else {
          setTimeout(() => {
              removeQuestionById(questionId);

              clearAnswersContainer();
              if (questions.length > 0) {
                  appendQuestion(getRandomQuestion());
              } else {
                  showEmptyMessage();
                  showResults();
              }
          }, 3000);

          const questionId = answerElement.dataset.question;
          markQuestion(questionId, false);

          removeIncorrectAnswers("");
      }
  }
});

function appendQuestion(questionObject) {
  const questionElement = `
      <li class="questions-list__item" data-question=${questionObject.id}>
          <div>
              ${data.length - questions.length + 1}. ${
      questionObject.question
  }
          </div>
      </li>
  `;
  questionsContainer.innerHTML += questionElement;
}

function appendAnswers(answers, questionId) {
  const currentAnswers = [...answers];

  for (let i = 0; i < answers.length; i++) {
      const randIndex = getRandomIndex(currentAnswers.length);
      const [answer] = currentAnswers.splice(randIndex, 1);

      const answerElement = `
          <li class="answers-list__item" data-answer=${answer.id} data-question=${questionId}>
              <div>
                  ${answer.text}
              </div>
          </li>
      `;
      answersContainer.innerHTML += answerElement;
  }
}

function markQuestion(questionId, isCorrect) {
  const questionElement = document.querySelector(
      `[data-question="${questionId}"]`
  );

  const question = getQuestionById(questionId);
  question.isCompleted = true;

  if (isCorrect) {
      questionElement.classList.add("questions-list__item--correct");
  } else {
      questionElement.classList.add("questions-list__item--error");
  }
}

function removeIncorrectAnswers(correctAnswerId) {
  const answersElements = document.querySelectorAll(".answers-list__item");

  answersElements.forEach((answerElement, index) => {
      if (answerElement.dataset.answer !== correctAnswerId) {
          setTimeout(() => {
              answerElement.classList.add("answers-list__item--remove");
          }, 600 * (index + 1));
      }
  });
}

function disableAnswers() {
  const answersElements = document.querySelectorAll(".answers-list__item");

  answersElements.forEach((answerElement) =>
      answerElement.classList.add("answers-list__item--disabled")
  );
}

function clearAnswersContainer() {
  answersContainer.innerHTML = "";
}

function showEmptyMessage() {
  const messageElement = `<p class="empty-message">Вопросы закончились</p>`;
  contentWrapper.innerHTML += messageElement;
}

function showResults() {
  const resultsElement = `<div class="result-alert">Статистика: ${score} из ${data.length}</div>`;
  contentWrapper.innerHTML += resultsElement;
}

function showCorrectAnswer(questionId) {
  const correctAnswer = getCorrectAnswer(questionId);

  contentWrapper.innerHTML = `
      <ul class="answers-list">
          <li class="answers-list__item answers-list__item--disabled" data-answer=${correctAnswer.id} data-question=${questionId}>
              <div>
                  ${correctAnswer.text}
                  <p class="description">
                      ${correctAnswer.description}
                  </p>
              </div>
          </li>
      </ul>
  `;
}

function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

function getRandomQuestion() {
  const randIndex = getRandomIndex(questions.length);
  return questions[randIndex];
}

function getQuestionById(id) {
  return data.find((question) => question.id === id);
}

function removeQuestionById(id) {
  const index = questions.findIndex((question) => question.id === id);
  questions.splice(index, 1);
}

function getAnswerById(id) {
  for (const question of questions) {
      const answer = question.answers.find((answer) => answer.id === id);
      if (answer) {
          return answer;
      }
  }

  return null;
}

function getCorrectAnswer(questionId) {
  const question = getQuestionById(questionId);
  return question.answers.find((answer) => answer.isCorrect);
}
