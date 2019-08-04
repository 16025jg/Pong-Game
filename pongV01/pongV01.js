/*
Term 1 2019
Jack Giddens
Pong

********** Versions **********
v01: created a ball object and made it display and move a random direction
     when the program starts
*/

const canvasWidth = 600;
const canvasHeight = 400;

var ball;

function setup() {
  
  ball = {

    //object properties
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
  createCanvas(canvasWidth, canvasHeight);

  ball.speedX *= random(ball.direction);
  ball.speedY *= random(ball.direction);
}

function draw() {

  background(65);

  ball.move();

  ball.bounce();

  ball.display();
}