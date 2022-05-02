import Category from './Category';
import ElementProp from './ElementProp';

class PaintersCategory extends Category {
  isCategorySelected = false;

  isBack;

  isQuestionCorrectArray = [
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

  #maxQuestionNum = 10;

  categoryImgNum = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

  constructor(parentElement, question) {
    super(question);
    this.parentElement = parentElement;
    this.question = question;
    this.header = document.querySelector('.question-title');
    this.totalAnswers = document.querySelectorAll('.total-answers');
    this.detail = document.querySelector('.detail');
    this.header.textContent = 'Кто автор этой картины?';
    this.detailClose = document.querySelector('.detail-close');
    this.parentElement.addEventListener('click', (e) => this.clickPain(e));
    this.detailClose.addEventListener('click', () => {
      this.detail.classList.remove('show');
    });
    this.parentElement.addEventListener('transitionend', () => this.categoryTransitionPain());
  }

  categoryTransitionPain() {
    if (this.isBack) {
      this.isBack = false;
      ElementProp.removeClass(this.questionElement, 'visible');
      ElementProp.addClass(this.homeButton, 'show');
      super.getCategoryImage();
      return;
    }
    if (this.isCategorySelected) {
      this.isCategorySelected = false;
      ElementProp.addClass(this.questionElement, 'visible');
      ElementProp.removeClass(this.homeButton, 'show');
      ElementProp.delete(this.categoryImages);
    } else if (this.parentElement.classList.contains('show')) {
      ElementProp.addClass(this.homeButton, 'show');
      super.getCategoryImage();
    } else {
      this.homePage.style.display = 'flex';
      ElementProp.removeClass(this.homePage, 'show');
      ElementProp.delete(this.categoryImages);
      ElementProp.removeClass(this.questionElement, 'visible');
      ElementProp.removeClass(this.parentElement, 'show');
      ElementProp.removeClass(this.questionElement, 'visible');
      ElementProp.removeClass(this.homeButton, 'show');
    }
  }

  clickPain(e) {
    if (e.target.dataset.info === 'true') {
      this.question.removeDetails();
      this.currentCategory = +e.target.dataset.number;
      e.stopPropagation();
      this.setStartQuestionNum();
      for (this.j = 0; this.j < this.#maxQuestionNum; this.j++) {
        this.val = localStorage.getItem(`image-${this.startQuestionNum + this.j}`);
        if (this.val === 'true') {
          this.isQuestionCorrectArray[this.j] = true;
        } else if (this.val === 'false') {
          this.isQuestionCorrectArray[this.j] = false;
        }
      }

      this.question.isQuestionCorrect = this.isQuestionCorrectArray.slice();
      this.question.addDetails();
      this.detail.classList.add('show');
      return;
    }

    this.parentElement.classList.remove('show');
    this.isCategorySelected = true;
    this.currentCategory = +e.target.dataset.category;
    this.setStartQuestionNum();
    this.question.createLayout();
    this.parentElement.removeEventListener('click', (event) => this.clickPain(event));
  }

  create() {
    super.create();
  }

  setStartQuestionNum() {
    switch (this.currentCategory) {
      case 1:
        this.startQuestionNum = 0;

        break;
      case 2:
        this.startQuestionNum = 10;

        break;
      case 3:
        this.startQuestionNum = 20;

        break;
      case 4:
        this.startQuestionNum = 30;

        break;
      case 5:
        this.startQuestionNum = 40;

        break;
      case 6:
        this.startQuestionNum = 50;

        break;
      case 7:
        this.startQuestionNum = 60;

        break;
      case 8:
        this.startQuestionNum = 70;

        break;
      case 9:
        this.startQuestionNum = 80;

        break;
      case 10:
        this.startQuestionNum = 90;

        break;
      case 11:
        this.startQuestionNum = 100;

        break;
      case 12:
        this.startQuestionNum = 110;

        break;
      default:
        break;
    }

    this.question.correctAnswerNum = this.startQuestionNum;
    this.question.startQuestionNum = this.startQuestionNum;
  }

  set isCategorySelected(value) {
    this.isCategorySelected = value;
  }

  get isCategorySelected() {
    return this.isCategorySelected;
  }

  set isBack(value) {
    this.isBack = value;
  }
}

export default PaintersCategory;
