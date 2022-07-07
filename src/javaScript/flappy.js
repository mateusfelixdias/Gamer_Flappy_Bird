function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;

  return element;
};

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const edge = newElement("div", "edge");
  const body = newElement("div", "body");

  this.element.appendChild(reverse ? body : edge);
  this.element.appendChild(reverse ? edge : body);

  this.setHeight = (height) => (body.style.height = `${height}px`);
};

function PairOfBarrier(height, opening, horizontalPosition) {
  this.element = newElement("div", "pairOfBarrier");

  this.upperBarrier = new Barrier(true);
  this.bottomBarrier = new Barrier(false);

  this.element.appendChild(this.upperBarrier.element);
  this.element.appendChild(this.bottomBarrier.element);

  this.drawOpening = () => {
    const topHeight = Math.random() * (height - opening);
    const lowerHeight = height - opening - topHeight;

    this.upperBarrier.setHeight(topHeight);
    this.bottomBarrier.setHeight(lowerHeight);
  };

  this.getHorizontalPosition = () =>
    parseInt(this.element.style.left.split("px")[0]);
  this.setHorizontalPosition = (horizontalPosition) =>
    (this.element.style.left = `${horizontalPosition}px`);
  this.getWidth = () => this.element.clientWidth;

  this.drawOpening();
  this.setHorizontalPosition(horizontalPosition);
};

function Barriers(height, width, opening, space, notifyReady) {
  this.pairs = [
    new PairOfBarrier(height, opening, width),
    new PairOfBarrier(height, opening, width + space),
    new PairOfBarrier(height, opening, width + space * 2),
    new PairOfBarrier(height, opening, width + space * 3),
  ];

  const displacement = 3;

  this.animation = () => {
    this.pairs.forEach((pair) => {
        pair.setHorizontalPosition(pair.getHorizontalPosition() - displacement);

        if(pair.getHorizontalPosition() < -pair.getWidth()){
            pair.setHorizontalPosition(pair.getHorizontalPosition() + space * this.pairs.length);
            pair.drawOpening();
        };

        const quite = width / 2;
        const crossedQuite = pair.getHorizontalPosition() + displacement >= quite && pair.getHorizontalPosition < quite;

        crossedQuite && notifyReady();
    });
  };
};

const barriers = new Barriers(700, 1200, 300, 400);
const areaGame = document.querySelector('[game-flappy]');

barriers.pairs.forEach(pair => areaGame.appendChild(pair.element));

setInterval(() => {
    barriers.animation();
}, 20);