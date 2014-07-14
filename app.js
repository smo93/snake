$(document).ready(function() {
  var c = $('#snake'),
    ctx = c.get(0).getContext('2d'),
    canvasWidth = c.width(),
    canvasHeight = c.height(),
    intId, speed = 165, color = '#000000',
    pause = false, pausable = false,
    reversable = false,
    topScores = JSON.parse(localStorage.getItem('topScores')),
    snake = {
      body : [[5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0]],
      length : 6,
      direction : 'right',
      dead : false,
      skinColor : '#000000',
      move : function() {
        if(this.dead) { return { errorType: 'death', msg: 'You are dead!' }; }

        var next;
        switch(snake.direction) {
          case 'left':
            next = [this.body[0][0] - 1, this.body[0][1]];
            if(next[0] < 0) { this.dead = true; return { errorType: 'wall', msg: 'You hit a wall!' }; }
            break;
          case 'right':
            next = [this.body[0][0] + 1, this.body[0][1]];
            if(next[0] >= canvasWidth / 10) { this.dead = true; return { errorType: 'wall', msg: 'You hit a wall!' }; }
            break;
          case 'up':
            next = [this.body[0][0], this.body[0][1] - 1];
            if(next[1] < 0) { this.dead = true; return { errorType: 'wall', msg: 'You hit a wall!' }; }
            break;
          case 'down':
            next = [this.body[0][0], this.body[0][1] + 1];
            if(next[1] >= canvasHeight / 10) { this.dead = true; return { errorType: 'wall', msg: 'You hit a wall!' }; }
            break;
        }

        if(this.body[1][0] === next[0] && this.body[1][1] === next[1]) {
          if(this.direction === 'left') { this.direction = 'right'; }
          else if(this.direction === 'right') { this.direction = 'left'; }
          else if(this.direction === 'up') { this.direction = 'down'; }
          else if(this.direction === 'down') { this.direction = 'up'; }
          snake.move();
          return true;
        }

        if(this.body.filter(function(elem) {
          return next[0] === elem[0] && next[1] === elem[1];
        }).length !== 0) {
          this.dead = true;
          return { errorType: 'body', msg: 'You hit yourself!' };
        }

        this.body.unshift(next);
        if(next[0] === food.position[0] && next[1] === food.position[1] && !food.eaten) {
          this.length += 1;
          food.eaten = true;
          food.spawn();

          $('#score').text('Score: ' + (this.length - 6) * 10);
        } else {
          this.body.pop();
        }

        return true;
      },
      render : function() {
        ctx.fillStyle = this.skinColor;
        this.body.forEach(function(bodyPart) {
          ctx.fillRect(bodyPart[0] * 10, bodyPart[1] * 10, 10, 10);
        });
      },
      checkScore : function() {
        var score = (this.length - 6) * 10,
          name;
        if(score > topScores[topScores.length - 1] || topScores.length < 10) {
          name = prompt('Enter your name:');
          if(name === '') { return; }
          topScores.push({ name: name, score: score });
          topScores.sort(function(lhs, rhs) {
            return rhs.score - lhs.score;
          });
          if(topScores.length > 10) { topScores.pop(); }
          localStorage.setItem('topScores', JSON.stringify(topScores));
        }
      }
    },
    food = {
      position: [10, 10],
      eaten: false,
      print: function() {
        if(!this.eaten) {
          ctx.fillStyle = '#123456';
          ctx.fillRect(this.position[0] * 10, this.position[1] * 10, 10, 10);
        }
      },
      spawn: function() {
        var position = [0, 0];
        position[0] = Math.floor(Math.random() * (canvasWidth / 10));
        position[1] = Math.floor(Math.random() * (canvasHeight / 10));

        if(snake.body.filter(function(elem) { return elem[0] === position[0] && elem[1] === position[1]; }).length !== 0) {
          this.spawn();
        }
        this.eaten = false;
        this.position = position;
      }
    };

  if(topScores === null) { topScores = []; }

  $(document).on('keydown', function(e) {
    switch(e.which) {
      case 37:
        if(snake.direction !== 'right') {
          snake.direction = 'left';
        }
        break;
      case 38:
        if(snake.direction !== 'down') {
          snake.direction = 'up';
        }
        break;
      case 39:
        if(snake.direction !== 'left') {
          snake.direction = 'right';
        }
        break;
      case 40:
        if(snake.direction !== 'up') {
          snake.direction = 'down';
        }
        break;
      case 80:
        if(pausable) {
          pause = !pause;
        }
        break;
      case 82:
        if(!reversable) { return; }
        var newDirection = [snake.body[snake.length - 1][0] - snake.body[snake.length - 2][0],
          snake.body[snake.length - 1][1] - snake.body[snake.length - 2][1]
        ];

        if(newDirection[0] === -1) { snake.direction = 'left'; }
        else if(newDirection[0] === +1) { snake.direction = 'right'; }
        else if(newDirection[1] === -1) { snake.direction = 'up'; }
        else if(newDirection[1] === +1) { snake.direction = 'down'; }

        snake.body.reverse();

        break;
    }
  });

  $('#top-scores').on('click', function() {
    $('#top-scores-modal').find('tbody').empty();
    topScores.forEach(function(elem, i) {
      $('#top-scores-modal').find('tbody').append(['<tr><td>', i + 1, '</td><td>', elem.name, '</td><td>', elem.score, '</td></tr>'].join(''));
    });
    $('#top-scores-modal').modal('toggle');
  });


  $('#speed').val(((165 - speed) / 15).toString()).on('change', function() {
    speed = 165 - parseInt($(this).val()) * 15;
  });

  $('#color').val(color).on('change', function() {
    color = $(this).val();
  });

  $('#pause').on('change', function() { pausable = !pausable; pause = false; });

  $('#reverse').on('change', function() { reversable = !reversable; });

  function init() {
    snake.body = [[8, 3], [7, 3], [6, 3], [5, 3], [4, 3], [3, 3]];
    snake.length = 6;
    snake.dead = false;
    snake.direction = 'right';
    snake.skinColor = color;
    $('#score').text('Score: 0');
    food.spawn();
  }

  function loop() {
    var error;
    if(!(pause && pausable)) {
      error = snake.move();
      if(error !== true) {
        alert(error.msg);
        clearInterval(intId);
        snake.checkScore();
      }
    } else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Paused', canvasWidth / 2 - 50, canvasHeight / 2 - 15);
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    snake.render();
    food.print();
  }

  $('#re-start').on('click', function() {
    init();
    clearInterval(intId);
    intId = setInterval(loop, speed);

    if($(this).text() === 'Start') {
      $(this).text('Restart');
    }
  });
});
