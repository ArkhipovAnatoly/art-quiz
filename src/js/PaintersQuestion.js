import delay from './delay';
import getRandomNum from './random';

import { getResource, getData } from './Http';

class PainterQuestion {
  #maxAnswerNum = 4;

  correctAnswerNum;

  timer;

  tooltips;

  detailImg;

  startQuestionNum;

  #maxQuestionNum = 10;

  currentIndex = 0;

  totalCorrect = 0;

  isFinished = false;

  id = 1;

  isQuestionCorrect = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  detailImg = [];

  resultItems;

  answerButtons;

  constructor(images, settings) {
    this.images = images;
    this.settings = settings;
    this.timer = this.settings.createTimer();
    this.question = document.querySelector('.question');
    this.maxQuestionsCounter = images.length - 1;
    this.questionImage = document.querySelector('.question-image');
    this.card = document.querySelector('.card');
    this.cardResult = document.querySelector('.card-result');
    this.cardResultText = document.querySelectorAll('.card-result>span');
    this.resultIndicator = document.querySelector('.result');
    this.answersBlock = document.querySelector('.answer');
    this.imagesBlock = document.querySelector('.images');
    this.nextButton = document.querySelector('.card-btn');
    this.exitButton = document.querySelector('.exit-btn');
    this.cardText = document.querySelectorAll('.card-text');
    this.cardImage = document.querySelector('.card-image');
    this.cardIcon = document.querySelector('.card-icon');
    this.detail = document.querySelector('.detail-wrapper');
    this.questionElement = document.querySelector('.question');
    this.title = document.querySelector('.question-title');
    this.backButton = document.querySelector('.question-button');

    this.nextButton.addEventListener('click', this.nextButtonListenerPain);
    this.exitButton.addEventListener('click', () => {
      this.questionImage.classList.remove('transparent');
      this.cardResult.classList.remove('show');
      if (this.isFinished) {
        this.currentIndex = 0;
        this.resultItems.forEach((el) => {
          el.remove();
        });
        this.answerButtons.forEach((el) => {
          el.remove();
        });
        this.settings.playEnd();
        if (this.settings.isTimerOn) {
          this.timer.set(this.settings.currentTimerValue);
          this.timer.stop();
        }
        this.isFinished = false;
        this.totalCorrect = 0;
        this.event = new Event('click');
        this.backButton.dispatchEvent(this.event);
      }
    });
    this.title.textContent = 'Кто автор этой картины?';

    this.questionImage.classList.add('visible');
    this.timer.on('elapsed', () => {
      this.settings.playError();
      this.timer.pause();
      this.cardIcon.src = './assets/img/png/error.png';
      this.resultItems[this.currentIndex].classList.add('error');
      this.fillCard(this.correctAnswerNum);
      this.questionImage.classList.add('transparent');
      this.card.classList.add('show');
    });
  }

  nextButtonListenerPain = () => {
    this.settings.playClick();
    this.questionImage.classList.remove('transparent');
    this.card.classList.remove('show');
    this.nextQuestion();
  };

  generateQuestion(questionNum) {
    this.questionImage.classList.add('visible');
    this.resultItemsL = document.querySelectorAll('.result-item').length;
    this.answerButtonsL = document.querySelectorAll('.answer-btn').length;

    if (this.resultItemsL === 0 && this.answerButtonsL === 0) {
      for (this.i = 0; this.i < this.#maxQuestionNum; this.i++) {
        this.div = document.createElement('div');
        this.div.classList.add('result-item');
        this.resultIndicator.append(this.div);
      }

      for (this.i = 0; this.i < this.#maxAnswerNum; this.i++) {
        this.button = document.createElement('button');
        this.button.classList.add('answer-btn');
        this.answersBlock.append(this.button);
      }
    }
    this.resultItems = document.querySelectorAll('.result-item');
    this.answerButtons = document.querySelectorAll('.answer-btn');

    this.getQuestionImage(questionNum);
    this.possibleAnswers = [];
    this.restAnswerNum = 3;
    this.possibleAnswers.push(this.images[this.correctAnswerNum].author);
    for (this.i = 0; this.i < this.restAnswerNum; this.i++) {
      this.random = getRandomNum(this.maxQuestionsCounter);
      if (this.possibleAnswers.includes(this.images[this.random].author)) {
        this.random = getRandomNum(this.maxQuestionsCounter);
      }
      this.possibleAnswers.push(this.images[this.random].author);
    }

    this.possibleAnswers.shuffle();

    this.possibleAnswers.forEach((answer, index) => {
      this.answerButtons[index].textContent = answer;
    });
  }

  async createLayout() {
    this.resultItemsL = document.querySelectorAll('.result-item').length;
    this.imagesItems = document.querySelectorAll('.image-item');
    if (this.imagesItems.length > 0) {
      this.imagesItems.forEach((el) => {
        el.remove();
      });
    }
    this.resultItemsL = document.querySelectorAll('.result-item').length;
    this.answerButtonsL = document.querySelectorAll('.answer-btn').length;

    if (this.resultItemsL === 0) {
      for (this.i = 0; this.i < this.#maxQuestionNum; this.i++) {
        this.div = document.createElement('div');
        this.div.classList.add('result-item');
        this.resultIndicator.append(this.div);
      }
    }
    if (this.answerButtonsL === 0) {
      for (this.i = 0; this.i < this.#maxAnswerNum; this.i++) {
        this.button = document.createElement('button');
        this.button.classList.add('answer-btn');
        this.answersBlock.append(this.button);
      }
    }

    this.resultItems = document.querySelectorAll('.result-item');
    this.answerButtons = document.querySelectorAll('.answer-btn');
    this.answersBlock.addEventListener('click', (e) => this.checkAnswer(e));
    await delay(500);

    this.generateQuestion(this.startQuestionNum);
  }

  async getQuestionImage(imageNum) {
    this.url = `https://raw.githubusercontent.com/ArkhipovAnatoly/image-data/assets/img/${imageNum}.jpg`;
    this.data = await getResource(this.url);
    if (this.settings.isTimerOn) {
      this.timer.set(this.settings.currentTimerValue);
      this.timer.start();
    }
    this.questionImage.src = `${this.data}`;
    this.cardImage.src = `${this.data}`;
    this.questionImage.classList.add('loaded');
    this.answerButtons.forEach((el) => {
      this.element = el;
      this.element.classList.add('loaded');
    });
  }

  fillCard(num) {
    this.cardText.forEach((el, index) => {
      this.element = el;
      switch (index) {
        case 0:
          this.element.textContent = this.images[num].name;
          break;
        case 1:
          this.element.textContent = this.images[num].author;
          break;
        case 2:
          this.element.textContent = this.images[num].year;
          break;
        default:
          break;
      }
    });
  }

  fillCardResult() {
    this.cardResultText[0].textContent = 'Раунд завершен!';
    this.cardResultText[1].textContent = `Количество верных ответов ${this.totalCorrect}`;
  }

  async nextQuestion() {
    this.questionImage.classList.remove('loaded');
    if (this.answerButtons !== undefined) {
      this.answerButtons.forEach((el) => {
        this.element = el;
        this.element.classList.remove('loaded');
      });
    }
    this.currentIndex += 1;
    if (this.currentIndex === this.#maxQuestionNum) {
      this.currentIndex = 0;
      this.isFinished = true;
      this.fillCardResult();
      this.questionImage.classList.add('transparent');
      this.cardResult.classList.add('show');
      return;
    }
    this.questionToShow = this.startQuestionNum + this.currentIndex;
    this.correctAnswerNum = this.questionToShow;
    await delay(2000);
    this.generateQuestion(this.questionToShow);
    this.answerButtons.forEach((el) => {
      this.element = el;
      this.element.classList.remove('correct');
      this.element.classList.remove('error');
    });
  }

  checkAnswer(e) {
    this.settings.playClick();
    this.currentAnswer = e.target.textContent;
    this.correctAnswer = this.images[this.correctAnswerNum].author;
    if (this.currentAnswer === this.correctAnswer) {
      this.settings.playCorrect();
      this.totalCorrect += 1;
      localStorage.setItem(`cat-${this.startQuestionNum}`, this.totalCorrect);
      this.timer.pause();
      this.isQuestionCorrect[this.currentIndex] = true;
      localStorage.setItem(`image-${this.startQuestionNum + this.currentIndex}`, 'true');
      e.target.classList.add('correct');
      this.resultItems[this.currentIndex].classList.add('correct');
      this.cardIcon.src = './assets/img/png/ok.png';
      this.fillCard(this.correctAnswerNum);
      this.questionImage.classList.add('transparent');
      this.card.classList.add('show');
    } else {
      this.settings.playError();
      this.isQuestionCorrect[this.currentIndex] = false;
      localStorage.setItem(`image-${this.startQuestionNum + this.currentIndex}`, 'false');
      localStorage.setItem(`cat-${this.startQuestionNum}`, this.totalCorrect);
      this.timer.pause();
      this.cardIcon.src = './assets/img/png/error.png';
      e.target.classList.add('error');
      this.resultItems[this.currentIndex].classList.add('error');
      this.fillCard(this.correctAnswerNum);
      this.questionImage.classList.add('transparent');
      this.card.classList.add('show');
    }
  }

  async addDetails() {
    this.values = [];

    for (this.i = 0; this.i < this.#maxQuestionNum; this.i++) {
      this.div = document.createElement('div');
      for (this.index = 0; this.index < 3; this.index++) {
        this.p = document.createElement('span');
        this.p.classList.add('tooltip');
        if (this.index === 0) {
          this.p.textContent = `${this.images[this.startQuestionNum + this.i].author}`;
        }
        if (this.index === 1) {
          this.p.textContent = `${this.images[this.startQuestionNum + this.i].name}`;
        }
        if (this.index === 2) {
          this.p.textContent = `${this.images[this.startQuestionNum + this.i].year}`;
        }
        this.div.append(this.p);
      }
      this.div.classList.add('detail-image');

      if (this.isQuestionCorrect[this.i] === false) {
        this.div.classList.add('filter-image');
      }
      this.values.push(this.startQuestionNum + this.i);
      this.detail.append(this.div);
    }
    this.tooltips = document.querySelectorAll('.tooltip');
    this.detailImg = document.querySelectorAll('.detail-image');
    this.detail.style.backgroundImage = 'url(./assets/img/gif/preloader.gif)';
    this.links = await getData(
      this.values,
      'https://raw.githubusercontent.com/ArkhipovAnatoly/image-data/assets/img/',
    );
    this.detail.style.backgroundImage = 'none';
    this.links.forEach((link, index) => {
      this.detailImg[index].style.backgroundImage = `url(${link.value})`;
    });
  }

  removeDetails() {
    this.tooltipsL = document.querySelectorAll('.tooltip').length;
    this.detailImgL = document.querySelectorAll('.detail-image').length;
    if (this.tooltipsL && this.detailImgL) {
      this.detailImg.forEach((el) => {
        el.remove();
      });
      this.tooltips.forEach((el) => {
        el.remove();
      });
    }
  }

  reset() {
    this.timer.stop();

    this.questionImage.classList.remove('transparent');
    this.card.classList.remove('show');
    this.questionImage.classList.remove('loaded');
    this.questionImage.classList.remove('visible');
  }

  set correctAnswerNum(value) {
    this.correctAnswerNum = value;
  }

  set startQuestionNum(value) {
    this.startQuestionNum = value;
  }

  get id() {
    return this.id;
  }

  set isQuestionCorrect(value) {
    this.isQuestionCorrect = value;
  }
}

export default PainterQuestion;
