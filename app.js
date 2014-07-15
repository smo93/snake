$(document).ready(function() {
  var c = $('#snake'),
    ctx = c.get(0).getContext('2d'),
    canvasWidth = c.width(),
    canvasHeight = c.height(),
    intId,
    pause = false,
    pausable = false,
    reversable = false,
    running = false,
    topScores = JSON.parse(localStorage.getItem('topScores'));

  if(topScores === null) { topScores = []; }

  ctx.font = '30px Arial';
  ctx.fillText('Click anywhere to start', canvasWidth / 2 - 150, canvasHeight / 2);

  $('#snake').on('mousedown', function() {
    $(this).focus();

    if(!running) {
      running = true;
      init();
      clearInterval(intId);
      intId = setInterval(loop, snake.speed);
    }

    return false;
  }).on('keydown', function(e) {
    if(e.which >= 37 && e.which <= 40) {
      var index = (e.which + 1) % 2;

      if(e.which <= 38 && snake.direction[index] === 0) {
        snake.direction[index] = -1;
      } else if(snake.direction[index] === 0) {
        snake.direction[index] = 1;
      }

      snake.direction[(index + 1) % 2] = 0;
      return false;
    }

    if(e.which === 80) {
      if(pausable) {
        pause = !pause;
        return false;
      }
    }

    if(e.which === 82) {
      if(reversable) {
        snake.direction = [
          snake.body[snake.length - 1][0] - snake.body[snake.length - 2][0],
          snake.body[snake.length - 1][1] - snake.body[snake.length - 2][1],
        ];

        snake.body.reverse();
      }

      return false;
    }
  });

  $('#top-scores').on('click', function() {
    $('#top-scores-modal').find('tbody').empty();
    topScores.forEach(function(elem, i) {
      $('#top-scores-modal').find('tbody').append(['<tr><td>', i + 1, '</td><td>', elem.name, '</td><td>', elem.score, '</td></tr>'].join(''));
    });
    $('#top-scores-modal').modal('toggle');
  });

  $('#pause').on('change', function() { pausable = !pausable; pause = false; });

  $('#reverse').on('change', function() { reversable = !reversable; });

  function checkScore() {
    if(topScores.length < 10 || snake.score > topScores[topScores.length - 1]) {
      var name = prompt(['Congatulations! You made a new high score!',
        'Please enter your name below.'].join('\n'));

      if(name === '') { return false; }

      if(topScores.length >= 10) { topScores.pop(); }

      topScores.push({
        name: name,
        score: snake.score
      });

      topScores.sort(function(lhs, rhs) {
        return rhs.score - lhs.score;
      });

      localStorage.setItem('topScores', JSON.stringify(topScores));
    }
  }

  function init() {
    snake = new Snake($('#color').val(), 165 - parseInt($('#speed').val()) * 15);
    snake.spawnFood();
    $('#score').text('Score: 0');
  }

  function loop() {
    var error;
    if(!(pause && pausable)) {
      error = snake.move();
      if(error !== true) {
        alert(error.msg);
        clearInterval(intId);
        checkScore();
      }
    } else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = 'black';
      ctx.fillText('Paused', canvasWidth / 2 - 50, canvasHeight / 2 - 15);
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if(snake.dead) {
      ctx.fillStyle = '#000000';
      ctx.fillText('Click anywhere to start', canvasWidth / 2 - 150, canvasHeight / 2);
      running = false;
    } else {
      snake.render(ctx);
    }
    $('#score').text('Score: ' + snake.score);
  }
});
