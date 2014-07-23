var
  foodWidth = 10,
  foodHeight = 10;

function Food() {
  if(!(this instanceof Food)) {
    return new Food();
  }

  this.food = [];
  this.eaten = true;

  this.render = function() {
    if(!this.eaten) {
      ctx.fillStyle = '#123456';
      ctx.fillRect(this.position[0] * foodWidth, this.position[1] * foodHeight, foodWidth, foodHeight);
    }
  };
}
