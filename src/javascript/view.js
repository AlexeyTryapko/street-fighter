class View {
  element;

  createElement({ tagName, classNames = null, attributes = {} }) {
    const element = document.createElement(tagName);
    if(classNames) element.classList.add(...classNames);
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
  }
}

export default View;
