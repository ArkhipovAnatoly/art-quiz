import 'normalize.css';
import '../styles/style.css';

import PaintersCategory from './PaintersCategory';
import PainterQuestion from './PaintersQuestion';
import PictureCategory from './PictureCategory';
import PictureQuestion from './PictureQuestion';
import Settings from './Settings';

import images from './images';

const control = document.querySelector('.controls');
const homePage = document.querySelector('.home-page');
const categoryPainters = document.querySelector('.category-painters');
const categoryPictures = document.querySelector('.category-pictures');
const homeButton = document.querySelectorAll('.home-btn');
const question = document.querySelector('.question');
const backButton = document.querySelector('.question-button');
const settingsMenu = document.querySelector('.settings-menu');

let paintersCategory;
let paintersQuestion;
let picturesCategory;
let picturesQuestion;
let choice = 0;
let isBack = false;
let eventUser;
const settings = new Settings();
settings.init();
function homePageTransition(e) {
  if (isBack) {
    isBack = false;
    return;
  }
  if (e.propertyName === 'transform' && e.target.id === 'home-page') {
    homePage.style.display = 'none';
  }
}
homePage.addEventListener('transitionend', (e) => homePageTransition(e));
control.addEventListener('click', (event) => {
  settings.playClick();
  switch (event.target.dataset.id) {
    case '1':
      settingsMenu.classList.remove('show');
      choice = 1;
      homePage.classList.add('hide');
      categoryPainters.classList.add('show');
      paintersQuestion = new PainterQuestion(images, settings);
      paintersCategory = new PaintersCategory(categoryPainters, paintersQuestion);
      paintersCategory.create();

      break;
    case '2':
      settingsMenu.classList.remove('show');

      choice = 2;
      homePage.classList.add('hide');
      categoryPictures.classList.add('show');
      picturesQuestion = new PictureQuestion(images, settings);
      picturesCategory = new PictureCategory(categoryPictures, picturesQuestion);
      picturesCategory.create();
      break;
    case '3':
      settingsMenu.classList.toggle('show');
      break;
    default:
      break;
  }

  function homeButtonClick() {
    isBack = true;
    settings.playClick();
    question.classList.remove('visible');

    if (choice === 1) {
      eventUser = new Event('transitionend');
      categoryPainters.dispatchEvent(eventUser);

      homePage.classList.remove('hide');
      categoryPainters.classList.remove('show');

      paintersQuestion.reset();
    } else if (choice === 2) {
      eventUser = new Event('transitionend');
      categoryPictures.dispatchEvent(eventUser);

      homePage.classList.remove('hide');
      categoryPictures.classList.remove('show');

      picturesQuestion.reset();
    }
  }

  homeButton.forEach((el) => {
    el.addEventListener('click', homeButtonClick);
  });
});

backButton.addEventListener('click', async () => {
  settings.playClick();

  question.classList.remove('visible');

  if (choice === 1) {
    if (paintersCategory.isCategorySelected) {
      paintersCategory.isBack = true;
    }
    categoryPainters.classList.add('show');
    paintersCategory.isCategorySelected = false;
    paintersQuestion.reset();

    paintersCategory.create();
  } else if (choice === 2) {
    if (picturesCategory.isCategorySelected) {
      picturesCategory.isBack = true;
    }
    categoryPictures.classList.add('show');
    picturesCategory.isCategorySelected = false;
    picturesQuestion.reset();

    picturesCategory.create();
  }
});

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
};
