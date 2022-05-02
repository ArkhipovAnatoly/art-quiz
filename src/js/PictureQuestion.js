import getRandomNum from './random';

import { getData } from './Http';
import ElementProp from './ElementProp';
import delay from './delay';

class PictureQuestion {
  #maxAnswerNum = 4;

  correctAnswerNum;

  timer = null;

  startQuestionNum;

  totalCorrect = 0;

  #maxQuestionNum = 10;

  currentIndex = 0;

  isFinished = false;

  id = 2;

  detailImg = [];

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

  constructor(images, settings) {
    this.images = images;
    this.settings = settings;
    this.timer = this.settings.createTimer();
    this.maxQuestionsCounter = images.length - 1;
    this.card = document.querySelector('.card');
    this.cardResult = document.querySelector('.card-result');
    this.cardResultText = document.querySelectorAll('.card-result>span');
    this.questionImage = document.querySelector('.question-image');
    this.resultIndicator = document.querySelector('.result');
    this.imagesBlock = document.querySelector('.images');
    this.nextButton = document.querySelector('.card-btn');

    this.exitButton = document.querySelector('.exit-btn');
    this.cardText = document.querySelectorAll('.card-text');
    this.cardImage = document.querySelector('.card-image');
    this.cardIcon = document.querySelector('.card-icon');
    this.title = document.querySelector('.question-title');
    this.detail = document.querySelector('.detail-wrapper');
    this.questionElement = document.querySelector('.question');
    this.backButton = document.querySelector('.question-button');
    this.imagesBlock.addEventListener('click', (e) => this.checkAnswer(e));

    this.nextButton.addEventListener('click', this.nextButtonListener);

    this.exitButton.addEventListener('click', () => {
      this.settings.playClick();
      this.imagesBlock.classList.remove('transparent');
      this.cardResult.classList.remove('show');
      if (this.isFinished) {
        this.currentIndex = 0;
        this.settings.playEnd();
        if (this.settings.isTimerOn) {
          this.timer.set(this.settings.currentTimerValue);
          this.timer.stop();
        }
        this.resultItems.forEach((el) => {
          el.remove();
        });
        this.imagesItems.forEach((el) => {
          el.remove();
        });
        this.isFinished = false;
        this.totalCorrect = 0;
        this.event = new Event('click');
        this.backButton.dispatchEvent(this.event);
      }
    });
    this.timer.on('elapsed', () => {
      this.settings.playError();
      this.timer.pause();
      this.imageIndex = this.possibleAnswers.findIndex(
        (value) => value === this.correctAnswerImageNum,
      );
      this.cardImage.src = this.results[this.imageIndex].value;
      this.cardIcon.src = './assets/img/png/error.png';
      this.resultItems[this.currentIndex].classList.add('error');
      this.fillCard(this.correctAnswerNum);
      this.imagesBlock.classList.add('transparent');
      this.card.classList.add('show');
    });
  }

  nextButtonListener = () => {
    this.settings.playClick();
    this.imagesBlock.classList.remove('transparent');
    this.card.classList.remove('show');
    this.nextQuestion();
  };

  generateQuestion() {
    this.possibleAnswers = [];
    this.restAnswerNum = 3;
    this.title.textContent = `Какую из этих картин нарисовал ${
      this.images[this.correctAnswerNum].author
    }`;
    this.correctAnswerImageNum = this.images[this.correctAnswerNum].imageNum;
    this.possibleAnswers.push(this.images[this.correctAnswerNum].imageNum);

    for (this.i = 0; this.i < this.restAnswerNum; this.i++) {
      this.random = getRandomNum(this.maxQuestionsCounter);
      this.possibleAnswers.push(this.images[this.random].imageNum);
    }

    this.possibleAnswers.shuffle();
    this.getQuestionImages(this.possibleAnswers);
    this.possibleAnswers.forEach((answer, index) => {
      this.imagesItems[index].setAttribute('num', answer);
    });
  }

  async getQuestionImages(values) {
    this.imagesBlock.style.backgroundImage = 'url(./assets/img/gif/preloader.gif)';
    this.results = await getData(
      values,
      'https://raw.githubusercontent.com/ArkhipovAnatoly/image-data/assets/img/',
    );
    this.imagesBlock.style.backgroundImage = 'none';
    if (this.settings.isTimerOn) {
      this.timer.set(this.settings.currentTimerValue);
      this.timer.start();
    }
    this.results.forEach((result, index) => {
      this.imagesItems[index].style.backgroundImage = `url(${result.value})`;
      ElementProp.addClass(this.imagesItems[index], 'loaded');
    });
  }

  async createLayout() {
    this.resultItemsL = document.querySelectorAll('.result-item').length;
    this.imagesItemsL = document.querySelectorAll('.image-item').length;
    this.answerButtons = document.querySelectorAll('.answer-btn');
    if (this.answerButtons.length > 0) {
      this.answerButtons.forEach((el) => {
        el.remove();
      });
    }
    this.imagesBlock.classList.add('visible');
    if (this.resultItemsL === 0) {
      for (this.i = 0; this.i < this.#maxQuestionNum; this.i++) {
        this.div = document.createElement('div');
        this.div.classList.add('result-item');
        this.resultIndicator.append(this.div);
      }
    }
    if (this.imagesItemsL === 0) {
      for (this.i = 0; this.i < this.#maxAnswerNum; this.i++) {
        this.div = document.createElement('div');
        this.div.classList.add('image-item');
        this.imagesBlock.append(this.div);
      }
    }

    this.resultItems = document.querySelectorAll('.result-item');
    this.imagesItems = document.querySelectorAll('.image-item');
    await delay(1000);
    this.generateQuestion();
  }

  async nextQuestion() {
    this.imagesBlock.classList.remove('transparent');
    if (this.imagesItems !== undefined) {
      this.imagesItems.forEach((image) => {
        image.classList.remove('loaded');
      });
    }

    this.currentIndex += 1;
    if (this.currentIndex === this.#maxQuestionNum) {
      this.isFinished = true;
      this.fillCardResult();
      this.imagesBlock.classList.add('transparent');
      this.cardResult.classList.add('show');
      return;
    }
    this.questionToShow = this.startQuestionNum + this.currentIndex;
    this.correctAnswerNum = this.questionToShow;
    await delay(600);
    this.generateQuestion();
    this.imagesItems.forEach((el) => {
      this.element = el;
      this.element.classList.remove('correct');
      this.element.classList.remove('error');
    });
  }

  checkAnswer(e) {
    this.settings.playClick();
    this.currentAnswer = e.target.getAttribute('num');
    if (this.currentAnswer === this.correctAnswerImageNum) {
      this.settings.playCorrect();
      this.timer.pause();
      this.imageIndex = this.possibleAnswers.findIndex(
        (value) => value === this.correctAnswerImageNum,
      );
      this.cardImage.src = this.results[this.imageIndex].value;
      this.totalCorrect += 1;
      this.isQuestionCorrect[this.currentIndex] = true;
      localStorage.setItem(`image-${this.startQuestionNum + this.currentIndex}`, 'true');
      localStorage.setItem(`cat-${this.startQuestionNum}`, this.totalCorrect);
      e.target.classList.add('correct');
      this.resultItems[this.currentIndex].classList.add('correct');
      this.cardIcon.src = './assets/img/png/ok.png';
      this.fillCard(this.correctAnswerNum);
      this.imagesBlock.classList.add('transparent');
      this.card.classList.add('show');
    } else {
      this.settings.playError();
      this.isQuestionCorrect[this.currentIndex] = false;
      localStorage.setItem(`image-${this.startQuestionNum + this.currentIndex}`, 'false');
      localStorage.setItem(`cat-${this.startQuestionNum}`, this.totalCorrect);
      this.timer.pause();
      this.cardIcon.src = './assets/img/png/error.png';
      this.imageIndex = this.possibleAnswers.findIndex(
        (value) => value === this.correctAnswerImageNum,
      );
      this.cardImage.src = this.results[this.imageIndex].value;
      e.target.classList.add('error');
      this.resultItems[this.currentIndex].classList.add('error');
      this.fillCard(this.correctAnswerNum);
      this.imagesBlock.classList.add('transparent');
      this.card.classList.add('show');
    }
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
    this.links = await getData(
      this.values,
      'https://raw.githubusercontent.com/ArkhipovAnatoly/image-data/assets/img/',
    );
    this.links.forEach((link, index) => {
      this.detailImg[index].style.backgroundImage = `url(${link.value})`;
    });
  }

  set startQuestionNum(value) {
    this.startQuestionNum = value;
  }

  set correctAnswerNum(value) {
    this.correctAnswerNum = value;
  }

  set isQuestionCorrect(value) {
    this.isQuestionCorrect = value;
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

    this.imagesItems.forEach((el) => {
      el.classList.remove('loaded');
    });
    this.imagesBlock.classList.remove('transparent');
    this.card.classList.remove('show');
    this.imagesBlock.classList.remove('visible');
  }
}

export default PictureQuestion;
