var
  bodypartW = 10,
  bodypartH = 10,
  cw = canvasWidth / bodypartW,
  ch = canvasHeight / bodypartH;

  console.log(canvasWidth, ch);

function Snake(color, speed) {
  if(!(this instanceof Snake)) {
    return new Snake(color, speed);
  }

  this.body = [[2, 2], [1, 2], [0, 2]];
  this.length = 3;
  this.direction = [1, 0];
  this.speed = speed;
  this.color = color;
  this.dead = false;
  this.score = 0;

  this.food = {
    position: [0, 0],
    eaten: true
  };

  this.eatsBody = function(next) {
    return this.body.filter(function(e) {
      return e[0] === next[0] && e[1] === next[1];
    }).length !== 0;
  };

  this.move = function() {
    if(this.dead) {
      return { errorType: 'death', msg: 'You are dead!' };
    }

    var next = [
      (this.body[0][0] + this.direction[0] + cw) % cw,
      (this.body[0][1] + this.direction[1] + ch) % ch
    ];

    if(this.body[1][0] === next[0] && this.body[1][1] === next[1]) {
      this.direction = [
        this.direction[0] * -1,
        this.direction[1] * -1
      ];

      return snake.move();
    }

    if(this.eatsBody(next)) {
      this.dead = true;
      return { errorType: 'body', msg: 'You hit yourself!' };
    }

    this.body.unshift(next);
    if(!this.eat()) {
      this.body.pop();
    }

    return true;
  };

  this.eat = function() {
    if(this.body[0][0] === this.food.position[0] &&
      this.body[0][1] === this.food.position[1] &&
      !this.food.eaten) {
      this.length += 1;
      this.score += (165 - this.speed) / 5;
      this.food.eaten = true;
      this.spawnFood();

      return true;
    }

    return false;
  };

  this.spawnFood = function() {
    this.food.position = [
      Math.floor(Math.random() * 80),
      Math.floor(Math.random() * 45)
    ];

    if(this.body.filter(function(e) {
      return e[0] === this.food.position[0] && e[1] === this.food.position[1];
    }, this).length !== 0) {
      this.spawnFood();
    } else {
      this.food.eaten = false;
    }
  };

  this.render = function(ctx) {
    ctx.fillStyle = this.color;
    this.body.forEach(function(bodyPart) {
      ctx.fillRect(bodyPart[0] * 10, bodyPart[1] * 10, 10, 10);
    });

    ctx.fillStyle = '#123456';
    ctx.fillRect(this.food.position[0] * 10, this.food.position[1] * 10, 10, 10);
  };
}

