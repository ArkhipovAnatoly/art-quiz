import Timer from './Timer';

class Settings {
  isTimerOn = false;

  isSoundOn = false;

  timer = new Timer('question-timer');

  currentTimerValue = 0;

  currentVolumeValue = 0;

  volumeDefault = 50;

  timerDefault = 15;

  constructor() {
    this.timerElement = document.querySelector('.question-timer');
    this.switchTimer = document.querySelector('#switch-timer');
    this.timerValueSelect = document.querySelector('.timer-value');
    this.switchSound = document.querySelector('#switch-sound');
    this.volumeValueSelect = document.querySelector('#volume-setting');
  }

  init() {
    this.#readSettings();

    this.switchTimer.addEventListener('change', this.#timerControl);
    this.switchSound.addEventListener('change', this.#soundControl);
    this.switchTimer.addEventListener('change', (e) => this.#timerControlValue(e));
    this.volumeValueSelect.addEventListener('change', (e) => this.#volumeControlValue(e));
    this.timerValueSelect.addEventListener('input', (e) => this.#timerControlValue(e));
  }

  createTimer() {
    return this.timer;
  }

  playClick() {
    if (this.currentVolumeValue > 0) {
      this.audioPlayer = new Audio('./assets/sounds/click.mp3');
      this.audioPlayer.volume = this.currentVolumeValue / 100;
      this.audioPlayer.play();
    }
  }

  playCorrect() {
    if (this.currentVolumeValue > 0) {
      this.audioPlayer = new Audio('./assets/sounds/correct.mp3');
      this.audioPlayer.volume = this.currentVolumeValue / 100;
      this.audioPlayer.play();
    }
  }

  playError() {
    if (this.currentVolumeValue > 0) {
      this.audioPlayer = new Audio('./assets/sounds/error.mp3');
      this.audioPlayer.volume = this.currentVolumeValue / 100;
      this.audioPlayer.play();
    }
  }

  playEnd() {
    if (this.currentVolumeValue > 0) {
      this.audioPlayer = new Audio('./assets/sounds/GameEnd.mp3');
      this.audioPlayer.volume = this.currentVolumeValue / 100;
      this.audioPlayer.play();
    }
  }

  #timerControl = () => {
    this.currentTimerValue = this.timerValueSelect.value;
    if (this.switchTimer.checked) {
      localStorage.setItem('isTimerOn', 'true');
      this.timerElement.style.display = 'block';
      this.isTimerOn = true;
      this.timerValueSelect.removeAttribute('disabled');
    } else {
      localStorage.setItem('isTimerOn', 'false');
      this.isTimerOn = false;

      this.timerElement.style.display = 'none';
      this.timerValueSelect.setAttribute('disabled', 'true');
    }
  };

  #timerControlValue = (e) => {
    this.currentTimerValue = e.target.value;
    localStorage.setItem('timerValue', this.currentTimerValue);
  };

  #soundControl = () => {
    if (this.switchSound.checked) {
      localStorage.setItem('isVolumeOn', 'true');
      this.volumeValueSelect.style.display = 'block';
      this.isSoundOn = true;
      this.currentVolumeValue = this.volumeValueSelect.value;
      this.volumeValueSelect.removeAttribute('disabled');
    } else {
      this.isSoundOn = false;
      localStorage.setItem('isVolumeOn', 'false');
      this.currentVolumeValue = 0;
      this.volumeValueSelect.style.display = 'none';
      this.volumeValueSelect.setAttribute('disabled', 'true');
    }
  };

  #readSettings() {
    this.value = localStorage.getItem('volumeValue');
    this.volumeValueSelect.value = this.value ?? this.volumeDefault;
    this.currentVolumeValue = this.value ?? this.volumeDefault;

    this.value = localStorage.getItem('isVolumeOn');
    if (this.value !== null) {
      if (this.value === 'true') {
        this.switchSound.setAttribute('checked', 'true');
      } else if (this.value === 'false') {
        this.switchSound.removeAttribute('checked');
      }
    }
    this.#soundControl();
    this.value = localStorage.getItem('timerValue');
    this.timerValueSelect.value = this.value ?? this.timerDefault;
    this.switchSound.value = this.value ?? this.timerDefault;

    this.value = localStorage.getItem('isTimerOn');
    if (this.value !== null) {
      if (this.value === 'true') {
        this.switchTimer.setAttribute('checked', 'true');
      } else if (this.value === 'false') {
        this.switchTimer.removeAttribute('checked');
      }
    }

    this.#timerControl();
  }

  #volumeControlValue(e) {
    this.playClick();
    this.currentVolumeValue = e.target.value;
    localStorage.setItem('volumeValue', this.currentVolumeValue);
  }

  get currentTimerValue() {
    return this.currentTimerValue;
  }

  get isTimerOn() {
    return this.isTimerOn;
  }

  get isSoundOn() {
    return this.isSoundOn;
  }

  get currentVolumeValue() {
    return this.currentVolumeValue;
  }
}
export default Settings;
