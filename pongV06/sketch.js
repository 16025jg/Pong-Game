/*
Term 1 2019
Jack Giddens
Pong

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
v06: create a timer, resets the ball in the middle of the canvas when it goes off the
     edge and when health goes below 0 shows a game over and restart message and when
     enter is pressed the program restarts
*/

var paddleArray = [];
var ballArray = [];
var keysArray = [];
var direct = ['1', '-1'];
var timer = 3;
var paddleReset;
var restart = false;

class Ball {
  constructor(xDirect, yDirect) {
    this.x = width / 2;
    this.y = height / 2;
    this.d = 30;
    this.r = this.d / 2;
    this.xVel = this.xStart * xDirect;
    this.yVel = this.yStart * yDirect;
    this.xStart = 3;
    this.yStart = 3;
    this.reduce = 160;
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
  }

  bounceWall (life1, life2) {
    if (this.y > height - this.r || this.y < this.r) {
      this.y = constrain(this.y, this.r, height - this.r);
      this.yVel *= -1;
    }
    if (this.x > width - this.r) {
      if (life2 == 0) {
        fill(216, 45, 45);
        text("game over \n ENTER to restart", width / 2, height / 2);
        restart = true;
      } else if (life2 > 0) {
        timer = 4;
        this.x = width / 2;
        this.y = height / 2;
        return true;
      }
    } else if (this.x < this.r) {
      if (life1 == 0) {
        fill(216, 45, 45);
        text("game over \n ENTER to restart", width / 2, height / 2);
        restart = true;
      } else if (life1 > 0) {
        timer = 4;
        this.x = width / 2;
        this.y = height / 2;
        return false;
      }
    }
  }

  bouncePaddle(paddleX, paddleY, paddleWidth, paddleHeight, paddleUpAcc, paddleDnAcc) {
    let dFront;
    let dEdge;

    if (this.y > paddleY - paddleHeight / 2 && this.y < paddleY + paddleHeight / 2) {
      if (this.xVel < 0) {
        dFront = dist(this.x - this.r, this.y, paddleX, this.y)
      } else {
        dFront = dist(this.x + this.r, this.y, paddleX, this.y)
      }

      if (dFront < paddleWidth / 2) {
        if (this.xVel < 0) {
          this.x = paddleX + paddleWidth / 2 + this.r;
          this.xVel *= -1 - paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
          this.yVel -= paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
        } else {
          this.x = paddleX - paddleWidth / 2 - this.r;
          this.xVel *= -1 - paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
          this.yVel -= paddleUpAcc / this.reduce - paddleDnAcc / this.reduce;
        }
      }
    }

    if (this.x < paddleX + paddleWidth / 2 && this.x > paddleX - paddleWidth / 2) {
      if (this.yVel < 0) {
        dEdge = dist(this.x, this.y - this.r, this.x, paddleY)
      } else {
        dEdge = dist(this.x, this.y + this.r, this.x, paddleY)
      }

      if (dEdge < paddleHeight / 2) {
        if (this.yVel < 0) {
          this.y = paddleY + paddleHeight / 2 + this.r;
          this.yVel *= -1;
          this.xVel *= -1;
        } else {
          this.y = paddleY - paddleHeight / 2 - this.r;
          this.yVel *= -1;
          this.xVel *= -1;
        }
      }
    }
  }

  timer(xDirect, yDirect) {
    if (timer > 0) {
      if (timer < 4) {
        fill(250);
        textAlign(CENTER, CENTER);
        textSize(50);
        text(timer, width / 2, 50);
        this.xVel = this.xStart * xDirect;
        this.yVel = this.yStart * yDirect;
        restart = false;
      } else if (timer > 3) {
        fill(250);
        textAlign(CENTER, CENTER);
        textSize(50);
        text("3", width / 2, 50);
      }
      if (frameCount % 60 == 0) {
        timer--;
      }
    } else if (timer == 0) {
      ballArray[0].move();
      timer = 0;
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
    this.width = 15;
    this.height = 100;
    this.maxVel = 16;
    this.upVel = 1;
    this.dnVel = 2;
    this.upAcc = 1;
    this.dnAcc = 1;
    this.life = 3;
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

  reset(_x, _y) {
    this.x = _x;
    this.y = _y;
    if (restart == true) {
      this.life = 3;
    }
  }

  health() {
    this.life--;
  }

  dispHealth() {
    fill(216, 45, 45);
    text(this.life, this.x, 50);
  }

  disp() {
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
  }
}

function setup() {

  frameRate(60);

  createCanvas(600, 400);

  rectMode(CENTER);
  ellipseMode(CENTER);

  paddleArray[0] = new Paddle(width / 30, height / 2);
  paddleArray[1] = new Paddle(width - width / 30, height / 2);

  ballArray[0] = new Ball(random(direct), random(direct));
}

function draw() {
  
  background(65);
  keyPress();

  paddleArray[0].disp();
  paddleArray[1].disp();

  paddleArray[0].dispHealth();
  paddleArray[1].dispHealth();

  paddleReset = ballArray[0].bounceWall(paddleArray[0].life, paddleArray[1].life);
  if (paddleReset == false) {
    paddleArray[0].reset(width / 30, height / 2);
    paddleArray[1].reset(width - width / 30, height / 2);
    paddleArray[0].health();
  } else if (paddleReset == true) {
    paddleArray[0].reset(width / 30, height / 2);
    paddleArray[1].reset(width - width / 30, height / 2);
    paddleArray[1].health();
  }

  ballArray[0].timer(random(direct), random(direct));

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
  }
  if (keysArray['s']) {
    paddleArray[0].accDn();
  } else {
    paddleArray[0].dccDn();
  }
  if (keysArray['ArrowUp']) {
    paddleArray[1].accUp();
  } else {
    paddleArray[1].dccUp();
  }
  if (keysArray['ArrowDown']) {
    paddleArray[1].accDn();
  } else {
    paddleArray[1].dccDn();
  }
  if (restart == true) {
    if (keysArray['Enter']) {
      paddleArray[0].reset(width / 30, height / 2);
      paddleArray[1].reset(width - width / 30, height / 2);
    }
  }
}
function keyPressed() {
  keysArray[key] = true;
}

function keyReleased() {
  keysArray[key] = false;
}