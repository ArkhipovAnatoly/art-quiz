class ElementProp {
  static delete(elements) {
    elements.forEach((el) => {
      if (el !== undefined) {
        el.remove();
      }
    });
  }

  static addClass(element, value) {
    element.classList.add(value);
  }

  static removeClass(element, value) {
    element.classList.remove(value);
  }
}

export default ElementProp;
