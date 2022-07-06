function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;

  return element;
};

function Barriers(reverse = false) {
  this.element = newElement("div", "barriers");

  const edge = newElement("div", "edge");
  const body = newElement("div", "body");

  this.element.appendChild(reverse ? body : edge);
  this.element.appendChild(reverse ? edge : body);

  this.setHeight = (height) => (body.style.height = `${height}px`);
};

function PairOfBarriers(height, opening, horizontalPosition) {
  this.element = newElement("div", "pairOfBarriers");

  this.upperBarrier = new Barriers(true);
  this.bottomBarrier = new Barriers(false);

  this.element.appendChild(this.upperBarrier.element);
  this.element.appendChild(this.bottomBarrier.element);

  this.drawOpening = () => {
    const topHeight = Math.random() * (height - opening);
    const lowerHeight = height - opening - topHeight;

    this.upperBarrier.setHeight(topHeight);
    this.bottomBarrier.setHeight(lowerHeight);
  };

  this.getHorizontalPosition = () => parseInt(this.element.style.left.split("px")[0]);
  this.setHorizontalPosition = (horizontalPosition) => (this.element.style.left = `${horizontalPosition}px`);
  this.getWidth = () => this.element.clientWidth;

  this.drawOpening();
  this.setHorizontalPosition(horizontalPosition);
}