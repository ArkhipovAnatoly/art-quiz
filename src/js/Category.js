import ElementProp from './ElementProp';
import { getData } from './Http';

class Category {
  #categoryQuantity = 12;

  startQuestionNum = 0;

  isCategorySelected;

  question = undefined;

  categoryImgNum;

  constructor(question) {
    this.question = question;

    this.questionElement = document.querySelector('.question');
    this.homeButton = document.querySelector('.home');
    this.homePage = document.querySelector('.home-page');
  }

  create() {
    for (this.i = 0; this.i < this.#categoryQuantity; this.i++) {
      this.div = document.createElement('div');
      this.span = document.createElement('span');
      this.button = document.createElement('button');
      this.button.setAttribute('data-info', 'true');
      this.button.setAttribute('data-number', `${this.i + 1}`);
      this.spanAnswers = document.createElement('span');
      ElementProp.addClass(this.spanAnswers, 'total-answers');
      ElementProp.addClass(this.span, 'category-title');
      ElementProp.addClass(this.button, 'info');
      this.span.setAttribute('data-category', `${this.i + 1}`);
      this.span.textContent = `Игра - ${this.i + 1}`;
      this.div.append(this.span);
      this.div.append(this.spanAnswers);
      this.div.append(this.button);
      this.div.setAttribute('data-category', `${this.i + 1}`);
      ElementProp.addClass(this.div, 'category-item');
      this.parentElement.append(this.div);
    }
    this.categoryImages = document.querySelectorAll('.category-item');
    this.categoryImages.forEach((el) => {
      el.addEventListener('transitionend', (e) => {
        e.stopPropagation();
      });
    });
    this.totalAnswers = document.querySelectorAll('.total-answers');
    this.titles = document.querySelectorAll('.category-title');
    this.infoButtons = document.querySelectorAll('.info');
    this.getAnswers(this.question.id);
  }

  getAnswers(id) {
    if (id === 1) {
      this.totalAnswers.forEach((_, index) => {
        this.data = localStorage.getItem(`cat-${index * 10}`);
        if (this.data != null) {
          this.totalAnswers[index].textContent = this.data;
          this.titles[index].classList.add('gold-text');
          this.infoButtons[index].classList.add('visible');
        }
      });
    } else if (id === 2) {
      for (this.i = 12; this.i <= 23; this.i++) {
        this.data = localStorage.getItem(`cat-${this.i * 10}`);
        if (this.data != null) {
          this.totalAnswers[this.i - 12].textContent = this.data;
          this.titles[this.i - 12].classList.add('gold-text');
          this.infoButtons[this.i - 12].classList.add('visible');
        }
      }
    }
  }

  async getCategoryImage() {
    this.parentElement.style.backgroundImage = 'url(./assets/img/gif/preloader.gif)';
    this.results = await getData(
      this.categoryImgNum,
      'https://raw.githubusercontent.com/ArkhipovAnatoly/image-data/assets/img/',
    );
    this.parentElement.style.backgroundImage = 'none';
    this.results.forEach((result, index) => {
      this.categoryImages[index].style.backgroundImage = `url(${result.value})`;
      ElementProp.addClass(this.categoryImages[index], 'loaded');
    });
  }
}

export default Category;
