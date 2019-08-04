/*
Term 1 2019
Jack Giddens
Pong

********** Versions **********
v01: created a ball object and made it display and move a random direction
     when the program starts
v02: created a paddle object and made it display and move with acceleration
*/

const canvasWidth = 600;
const canvasHeight = 400;

var ball;
var paddle;

var keysArray = [];

function setup() {

  createCanvas(canvasWidth, canvasHeight);

  rectMode(CENTER);

  ball = {

    x: canvasWidth / 2,
    y: canvasHeight / 2,
    diameter: 30,
    speedX: 5,
    speedY: 5,
    direction: ['-1', '1'],

    move: function() {
      this.x += this.speedX;
      this.y += this.speedY;
    },

    bounce: function() {
      if (this.y > height - this.diameter / 2 || this.y < this.diameter / 2) {
        this.y = constrain(this.y - this.diameter/2, this.diameter/2, height);
        this.speedY *= -1;
      }
    },

    display: function() {
      fill(255, 255, 255);
      ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  };

  paddle = {

    //object properties
    x: canvasWidth / 60,
    y: canvasHeight / 2,
    width: 15,
    height: 100,
    maxSpeed: 16,
    speedUp: 1,
    speedDown: 2,
    accUp: 1,
    accDown: 1,

    move: function() {
      if (keysArray['w']) {
        this.y -= this.accUp;
        if (this.accUp < this.maxSpeed) {
          this.accUp += this.speedUp;
        }
      } else if (this.accUp > 0) {
        this.y -= this.accUp;
        this.accUp -= this.speedDown;
      }

      if (keysArray['s']) {
        this.y += this.accDown;
        if (this.accDown < this.maxSpeed) {
          this.accDown += this.speedUp;
        }
      } else if (this.accDown > 0) {
        this.y += this.accDown;
        this.accDown -= this.speedDown;
      }
      this.y = constrain(this.y, 0 + this.height / 2, height - this.height / 2);
    },
    display: function() {
      fill(255, 255, 255);
      rect(this.x, this.y, this.width, this.height);
    }
  };

  ball.speedX *= random(ball.direction);
  ball.speedY *= random(ball.direction);
}

function draw() {
  background(65);

  ball.move();

  ball.bounce();

  ball.display();

  paddle.move();
  
  paddle.display();
}

function keyPressed() {
  keysArray[key] = true;
}

function keyReleased() {
  keysArray[key] = false;
}