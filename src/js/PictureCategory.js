import Category from './Category';
import ElementProp from './ElementProp';

class PictureCategory extends Category {
  categoryImgNum = [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230];

  startQuestionNum;

  isBack;

  maxQuestionNum = 10;

  currentIndex = 0;

  isCategorySelected = false;

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

  constructor(parentElement, question) {
    super(question);
    this.parentElement = parentElement;
    this.question = question;
    this.header = document.querySelector('.question-title');
    this.totalAnswers = document.querySelectorAll('.total-answers');
    this.detail = document.querySelector('.detail');
    this.detailClose = document.querySelector('.detail-close');
    this.parentElement.addEventListener('click', (e) => this.clickPic(e));
    this.detailClose.addEventListener('click', () => {
      this.detail.classList.remove('show');
    });
    this.parentElement.addEventListener('transitionend', () => this.categoryTransitionPic());
  }

  categoryTransitionPic() {
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
      ElementProp.removeClass(this.questionElement, 'visible');
      ElementProp.removeClass(this.parentElement, 'show');
      ElementProp.removeClass(this.questionElement, 'visible');
      ElementProp.removeClass(this.homeButton, 'show');
    }
  }

  clickPic(e) {
    if (e.target.dataset.info === 'true') {
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
    this.parentElement.removeEventListener('click', (event) => this.clickPic(event));
  }

  create() {
    super.create();
  }

  setStartQuestionNum() {
    switch (this.currentCategory) {
      case 1:
        this.startQuestionNum = 120;
        break;
      case 2:
        this.startQuestionNum = 130;
        break;
      case 3:
        this.startQuestionNum = 140;
        break;
      case 4:
        this.startQuestionNum = 150;
        break;
      case 5:
        this.startQuestionNum = 160;
        break;
      case 6:
        this.startQuestionNum = 170;
        break;
      case 7:
        this.startQuestionNum = 180;
        break;
      case 8:
        this.startQuestionNum = 190;
        break;
      case 9:
        this.startQuestionNum = 200;
        break;
      case 10:
        this.startQuestionNum = 210;
        break;
      case 11:
        this.startQuestionNum = 220;
        break;
      case 12:
        this.startQuestionNum = 230;
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

export default PictureCategory;
