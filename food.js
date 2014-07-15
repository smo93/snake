function Food() {
  if(!(this instanceof Food)) {
    return new Food();
  }

  this.food = [];
  this.eaten = true;

  this.render = function() {
    if(!this.eaten) {
      ctx.fillStyle = '#123456';
      ctx.fillRect(this.position[0] * 10, this.position[1] * 10, 10, 10);
    }
  };
}
