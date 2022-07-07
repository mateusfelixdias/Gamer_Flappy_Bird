const imageBird = '../image/bird.png';

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


function Bird(gameHeight){
  let flying = false;

  this.element = newElement('img', 'bird');
  this.element.src = imageBird;

  this.getHorizontalPositionBird = () => parseInt(this.element.style.bottom.split('px')[0]);

  this.setHorizontalPositionBird = (verticalPositionOfTheBird) => this.element.style.bottom = `${verticalPositionOfTheBird}px`;

  window.onkeydown = event => flying = true;
  window.onkeyup = event => flying = false;

  this.animation = () => {
    const newVerticalPositionOfTheBird = this.getHorizontalPositionBird() + (flying ? 8 : -5);
    const maximumHeight = gameHeight - this.element.clientWidth;

    if(newVerticalPositionOfTheBird <= 0) {
      this.setHorizontalPositionBird(0);
    } else if (newVerticalPositionOfTheBird >= maximumHeight) {
      this.setHorizontalPositionBird(maximumHeight);
    } else {
      this.setHorizontalPositionBird(newVerticalPositionOfTheBird);
    };
  };

  this.setHorizontalPositionBird(gameHeight / 2);
};


function Progress() {
  this.element = newElement('span', 'progress');
  this.updatePoints = (points) => {
    this.element.innerHTML = points;
  };
};


function areSuperimposed(barrierFromAbove, barrierFromBelow) {
  const barrier_from_above = barrierFromAbove.getBoundingClientRect();
  const barrier_from_below = barrierFromBelow.getBoundingClientRect();

  const sideWidthInBarrierFromAbove = barrier_from_above.left + barrier_from_above.width >= barrier_from_below.left ;
  const sideWidtharrierFromBelow = barrier_from_below.left + barrier_from_below.width >= barrier_from_above.left;

  const horizontal = sideWidthInBarrierFromAbove && sideWidtharrierFromBelow;

  const sideheightInBarrierFromAbove = barrier_from_above.top + barrier_from_above.height >= barrier_from_below.top;
  const sideheightarrierFromBelow = barrier_from_below.top + barrier_from_below.height >= barrier_from_above.top;

  const vertical = sideheightInBarrierFromAbove && sideheightarrierFromBelow;

  return horizontal && vertical;
};


function collided(bird, barriers) {
  let collided = false;

  barriers.pairs.forEach((pairOfBarrier) => {
    if(!collided){
      const higher = pairOfBarrier.upperBarrier.element;
      const bottom = pairOfBarrier.bottomBarrier.element;

      collided = areSuperimposed(bird.element, higher) || areSuperimposed(bird.element, bottom);
    };
  });

  return collided;
};


function FlappyBird(){
  let points = 0;
  
  const areaGame = document.querySelector('[game-flappy]');

  const height = areaGame.clientHeight;
  const width = areaGame.clientWidth;

  const progress = new Progress();
  const barriers = new Barriers(height, width, 200, 400, () => progress.updatePoints(++points));
  const bird = new Bird(height);

  areaGame.appendChild(progress.element);
  areaGame.appendChild(bird.element);
  barriers.pairs.forEach(pair => areaGame.appendChild(pair.element));

  this.startGamer = () => {
    const timer = setInterval(() => {
      barriers.animation();
      bird.animation();

      if(collided(bird, barriers)){
        clearInterval(timer);
      };
    }, 20);
  };
};


new FlappyBird().startGamer();