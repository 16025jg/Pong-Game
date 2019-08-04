/*
Pong
Term 2 2019
Jack Giddens

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
v06: create a timer, resets the ball in the middle of the canvas when it goes off
     the edge and when health goes below 0 shows a game over and restart message
     and when
     enter is pressed the program restarts
v07: create a single player mode and a menu where the player has a choice between
     one player or two player modes
v08: create an ai difficulty slider for single player mode
*/

var paddleArray = [];
var ballArray = [];

var keysArray = [];
var direct = ['1', '-1'];
var timer = 3;
var paddleReset;
var restart = false;
var onePlayer = false;
var onePlayerDif = false;
var twoPlayer = false;
var aiReact = 0;
var aiMaxVel = 0;

class Ball {
  constructor(xDirect, yDirect) {
    this.x = width / 2;
    this.y = height / 2;
    this.d = 30;
    this.r = this.d / 2;
    this.xVel = this.xStart * xDirect;
    this.yVel = this.yStart * yDirect;
    this.xStart = 5;
    this.yStart = 5;
    this.reduce = 100;
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
  }

  bounceWall(life1, life2) {
    if (this.y > height - this.r || this.y < this.r) {
      this.y = constrain(this.y, this.r, height - this.r);
      this.yVel *= -1;
    }

    if (this.x > width - this.r) {
      if (life2 == 0) {
        fill(250, 100, 130);
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
        fill(250, 100, 130);
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

        if (restart == true) {
          onePlayer = false;
          twoPlayer = false;
          restart = false;
        }
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
    this.y = constrain(this.y, this.height / 2, height - this.height / 2);
  }

  accDn() {
    this.y += this.dnAcc;
    if (this.dnAcc < this.maxVel) {
      this.dnAcc += this.upVel;
    }
    this.y = constrain(this.y, this.height / 2, height - this.height / 2);
  }

  dccUp() {
    if (this.upAcc > 0) {
      this.y -= this.upAcc;
      this.upAcc -= this.dnVel;
    }

    this.y = constrain(this.y, this.height / 2, height - this.height / 2);
  }

  dccDn() {
    if (this.dnAcc > 0) {
      this.y += this.dnAcc;
      this.dnAcc -= this.dnVel;
    }

    this.y = constrain(this.y, this.height / 2, height - this.height / 2);
  }

  paddleAi(ballX, ballY, ballXVel, _aiReact, _aiMaxVel) {
    if (ballX < width - width / _aiReact && ballXVel < 0 && ballX > 0) {

      this.maxVel = _aiMaxVel;

      if (ballY == this.y) {
        this.upAcc = 0;
        this.dnAcc = 0;
      }
      if (ballY < this.y) {
        paddleArray[0].accUp();
      } else {
        paddleArray[0].dccUp();
      }
      if (ballY > this.y) {
        paddleArray[0].accDn();
      } else {
        paddleArray[0].dccDn();
      }
    }
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
    fill(250, 100, 130);
    text(this.life, this.x, 50);
  }

  disp() {
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
  }
}


function setup() {

  frameRate(60);
  createCanvas(800, 500);

  rectMode(CENTER);
  ellipseMode(CENTER);

  paddleArray[0] = new Paddle(width / 30, height / 2);
  paddleArray[1] = new Paddle(width - width / 30, height / 2);

  ballArray[0] = new Ball(random(direct), random(direct));
}

function draw() {
  
  background(65);
  
  menu();
  difScreen();

  if (onePlayer == true || twoPlayer == true) {
    
    keyPress();
    
    if (onePlayer == true) {
      paddleArray[0].paddleAi(ballArray[0].x, ballArray[0].y, ballArray[0].xVel, aiReact, aiMaxVel);
    }

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
      ballArray[0].bouncePaddle(paddleArray[i].x, paddleArray[i].y, paddleArray[i].width,
        paddleArray[i].height, paddleArray[i].upAcc, paddleArray[i].dnAcc);
    }
  }
}

function menu() {

  if (onePlayerDif == false && twoPlayer == false && onePlayer == false) {

    if (mouseX < width / 2 && mouseX > 0 && mouseY > 0 && mouseY < height) {
      fill(125, 140, 163);
      rect(width / 4, height / 2, width / 2, height);
    } else {
      fill(121, 169, 209);
      rect(width / 4, height / 2, width / 2, height);
    }

    if (mouseX > width / 2 && mouseX < width && mouseY > 0 && mouseY < height) {
      fill(185, 131, 137);
      rect(width / 1.3333, height / 2, width / 2, height);
    } else {
      fill(250, 100, 130);
      rect(width / 1.3333, height / 2, width / 2, height);
    }

    noStroke();
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('One\nPlayer', width * 0.25, height / 2);
    text('Two\nPlayer', width * 0.75, height / 2);
  }
}

function difScreen() {
  
  if (onePlayerDif == true) {

    fill(125, 140, 163);
    rect(width / 4, height / 2, width / 2, height);

    noStroke();
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('One\nPlayer', width * 0.25, height / 2);

    if (mouseY < height / 3 && mouseY > 0 && mouseX > width / 2 && mouseX < width) {
      fill(125, 140, 163);
      rect(width / 1.3333, height / 6, width / 2, height / 3);
    } else {
      fill(121, 169, 209);
      rect(width / 1.3333, height / 6, width / 2, height / 3);
    }

    if (mouseY < height / 1.5 && mouseY > height / 3 && mouseX > width / 2 &&
      mouseX < width) {
      fill(125, 140, 163);
      rect(width / 1.3333, height / 2, width / 2, height / 3);
    } else {
      fill(121, 169, 209);
      rect(width / 1.3333, height / 2, width / 2, height / 3);
    }

    if (mouseY < height && mouseY > height / 1.5 && mouseX > width / 2 && mouseX <
      width) {
      fill(125, 140, 163);
      rect(width / 1.3333, height / 1.2, width / 2, height / 3);
    } else {
      fill(121, 169, 209);
      rect(width / 1.3333, height / 1.2, width / 2, height / 3);
    }

    noStroke();
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Easy', width / 1.3333, height / 6);
    text('Medium', width / 1.3333, height / 2);
    text('Hard', width / 1.3333, height / 1.2);
  }
}

function keyPress() {
  
  if (twoPlayer == true) {
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

function mousePressed() {

  if (onePlayerDif == false && twoPlayer == false && onePlayer == false) {
    if (mouseX < width / 2 && mouseX > 0 && mouseY > 0 && mouseY < height) {
      onePlayerDif = true;
    }

    if (mouseX > width / 2 && mouseX < width && mouseY > 0 && mouseY < height) {
      twoPlayer = true;
    }
  }
  if (onePlayerDif == true) {
    //easy
    if (mouseY < height / 3 && mouseY > 0 && mouseX > width / 2 && mouseX < width) {
      onePlayer = true;
      onePlayerDif = false;
      aiReact = 1.65;
      aiMaxVel = 4.1;
    }

    if (mouseY < height / 1.2 && mouseY > height / 3 && mouseX > width / 2 && mouseX <
      width) {
      onePlayer = true;
      onePlayerDif = false;
      aiReact = 1.7;
      aiMaxVel = 5.6;
    }

    if (mouseY < height && mouseY > height / 1.5 && mouseX > width / 2 && mouseX <
      width) {
      onePlayer = true;
      onePlayerDif = false;
      aiReact = 3;
      aiMaxVel = 6.9;
    }
  }
}

function keyPressed() {
  keysArray[key] = true;
}

function keyReleased() {
  keysArray[key] = false;
}