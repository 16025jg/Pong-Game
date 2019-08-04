/*
Term 1 2019
Jack Giddens
Pong

********** Versions **********
v01: created a ball object and made it display and move a random direction
     when the program starts
v02: created a paddle object and made it display and move with acceleration
v03: created a paddle constructor function so I can draw two paddles with            different positions given through parameters
*/

var paddleArray = [];
var keysArray = [];

class Paddle {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.width = 15;
    this.height = 100;
    this.maxVel = 16;
    this.upVel = 1;
    this.dnVel = 2;
    this.upAcc = 1;
    this.dnAcc = 1;
  }
  
  accUp() {
    this.y -= this.upAcc;
    if (this.upAcc < this.maxVel) {
      this.upAcc += this.upVel;
    }
    this.y = constrain(this.y, 0 + this.height / 2, height - this.height / 2);
  }

  accDn() {
    this.y += this.dnAcc;
    if (this.dnAcc < this.maxVel) {
      this.dnAcc += this.upVel;
    }
    this.y = constrain(this.y, 0 + this.height / 2, height - this.height / 2);
  }
  
  dccUp() {
    if (this.upAcc > 0) {
      this.y -= this.upAcc;
      this.upAcc -= this.dnVel;
    }
    this.y = constrain(this.y, 0 + this.height / 2, height - this.height / 2);
  }
  
  dccDn() {
    if (this.dnAcc > 0) {
      this.y += this.dnAcc;
      this.dnAcc -= this.dnVel;
    }
    this.y = constrain(this.y, 0 + this.height / 2, height - this.height / 2);
  }

  disp() {
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
  }
}

function setup() {
  
  createCanvas(600, 400);
  
  rectMode(CENTER);
  ellipseMode(CENTER);
  
  paddleArray[0] = new Paddle(width / 30, height / 2);
  paddleArray[1] = new Paddle(width - width / 30, height / 2);

}

function draw() {
  background(65);
  
  paddleArray[0].disp();
  paddleArray[1].disp();
  
  keyPress();
}

function keyPress() {
  if (keysArray['w']) {
    paddleArray[0].accUp();
  } else {
    paddleArray[0].dccUp();
  };
  if (keysArray['s']) {
    paddleArray[0].accDn();
  } else {
    paddleArray[0].dccDn();
  };
  if (keysArray['ArrowUp']) {
    paddleArray[1].accUp();
  } else {
    paddleArray[1].dccUp();
  };
  if (keysArray['ArrowDown']) {
    paddleArray[1].accDn();
  } else {
    paddleArray[1].dccDn();
  };
}

function keyPressed() {
  keysArray[key] = true;
}
function keyReleased() {
  keysArray[key] = false;
}