/*
Term 1 2019
Jack Giddens
Pongs

********** Versions **********
v01: created a ball object and made it display and move a random direction
     when the program starts
v02: created a paddle object and made it display and move with acceleration
v03: created a paddle constructor function so I can draw two paddles with different
     positions given through parameters
v04: created a ball constructor function that displays and moves the ball
     a random direction when the program starts
v05: create a bounce function where the ball will bounce off the paddle with
     acceleration by adding the paddles acceleration to the balls speed
*/

var paddleArray = [];
var ballArray = [];
var keysArray = [];
var direct = ['1', '-1'];

class Ball {
  constructor(xDirect, yDirect) {
    this.x = width / 2;
    this.y = height / 2;
    this.d = 30;
    this.r = this.d / 2;
    this.xVel = 5 * xDirect;
    this.yVel = 5 * yDirect;
    this.reduce = 160;
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
  }

  bounceWall() {
    if (this.y > height - this.r || this.y < this.r) {
      this.y = constrain(this.y, this.r, height - this.r);
      this.yVel *= -1;
    }
  }

  bouncePaddle(paddleX, paddleY, paddleWidth, paddleHeight, paddleUpAcc, paddleDnAcc) {
    let d;
    let dd;

    if (this.y > paddleY - paddleHeight / 2 && this.y < paddleY + paddleHeight / 2) {
      if (this.xVel < 0) {
        d = dist(this.x - this.r, this.y, paddleX, this.y)
      } else {
        d = dist(this.x + this.r, this.y, paddleX, this.y)
      }
      
      if (d < paddleWidth/2) {
        if (this.xVel < 0) {
          this.x = paddleX + paddleWidth/2 + this.r;
          this.xVel *= -1 - paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
          this.yVel -= paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
        } else {
          this.x = paddleX - paddleWidth/2 - this.r;
          this.xVel *= -1 - paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
          this.yVel -= paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
        }
      }
    }

    if (this.x < paddleX + paddleWidth/2 && this.x > paddleX - paddleWidth/2) {
      if (this.yVel < 0) {
        dd = dist(this.x, this.y - this.r, this.x, paddleY)
      } else {
        dd = dist(this.x, this.y + this.r, this.x, paddleY)
      }
      
      if(dd < paddleHeight/2) {
        if (this.yVel < 0) {
          this.y = paddleY + paddleHeight/2 + this.r;
          this.yVel *= -1;
          this.xVel *= -1;
        } else {
          this.y = paddleY - paddleHeight/2 - this.r;
          this.yVel *= -1;
          this.xVel *= -1;
        }
      }
    }
  }

  disp() {
    fill(255, 255, 255);
    ellipse(this.x, this.y, this.d, this.d);
  }
}

class Paddle {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.width = 16;
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
  
  frameRate(60)

  createCanvas(600, 400);

  rectMode(CENTER);
  ellipseMode(CENTER);

  paddleArray[0] = new Paddle(width / 30, height / 2);
  paddleArray[1] = new Paddle(width - width / 30, height / 2);

  ballArray[0] = new Ball(random(direct), random(direct));
}

function draw() {
  background(65);

  paddleArray[0].disp();
  paddleArray[1].disp();

  keyPress();

  ballArray[0].move();
  ballArray[0].bounceWall();
  ballArray[0].disp();

  for (i = 0; i < paddleArray.length; i++) {
    ballArray[0].bouncePaddle(paddleArray[i].x, paddleArray[i].y, paddleArray[i].width, paddleArray[i].height, paddleArray[i].upAcc, paddleArray[i].dnAcc);
  }
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