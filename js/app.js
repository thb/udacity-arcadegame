// A simple object with 'static' constants and methods
// to manage positions on the grid
var GridUtils = {};

GridUtils.CELL_WIDTH = 101;
GridUtils.CELL_HEIGHT = 83;
GridUtils.NROWS = 6;
GridUtils.NCOLS = 5;
GridUtils.Y_CORRECTING_FACTOR = 25;
GridUtils.CANVAS_WIDTH = GridUtils.CELL_WIDTH * GridUtils.NCOLS;
GridUtils.CANVAS_HEIGHT = GridUtils.CELL_HEIGHT * GridUtils.NROWS;

// returns randomly 0, 1, 2, ..., max - 1
GridUtils.getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

GridUtils.positionYOfRow = function(int) {
  return int * GridUtils.CELL_HEIGHT - GridUtils.Y_CORRECTING_FACTOR;
};
GridUtils.positionXOfColumn = function(int) {
  return int * GridUtils.CELL_WIDTH;
};
GridUtils.printMessage = function(message) {
  let messageEl = document.querySelector(".message");
  if (null === messageEl) {
    messageEl = document.createElement("p");
    messageEl.classList.add("message");
    document.body.appendChild(messageEl);
  }
  messageEl.innerText = message;
  window.setTimeout(function() {
    messageEl.innerText = "";
  }, 1500);
};

// Checks if an enemy and the player are in collision
// the y coordinate is allways the same
// the x coorinate must be included between -20 and +20
// as enemy speed might let the x coordinate be
// exactly the same for the player and the enemy
GridUtils.collision = function(enemy, player) {
  if (
    enemy.y == player.y &&
    (enemy.x - 20 <= player.x && player.x <= enemy.x + 20)
  ) {
    return true;
  } else {
    return false;
  }
};

// Enemies our player must avoid
function Enemy() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
  // The x, y position to start from
  this.y = GridUtils.positionYOfRow(GridUtils.getRandomInt(3) + 1);
  this.x = 0;
  // The speed factor for our enemies
  this.speed = (GridUtils.getRandomInt(3) + 1) * 200;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  this.sprite = "images/char-boy.png";
  this.y = GridUtils.positionYOfRow(5);
  this.x = GridUtils.positionXOfColumn(2);
}

Player.prototype.update = function(dt) {};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {
  switch (keyCode) {
    case "space":
      window.clearInterval(interval);
      break;
    case "left":
      if (this.x - GridUtils.CELL_WIDTH >= 0) {
        this.x -= GridUtils.CELL_WIDTH;
      }
      break;
    case "right":
      if (this.x + GridUtils.CELL_WIDTH < GridUtils.CANVAS_WIDTH) {
        this.x += GridUtils.CELL_WIDTH;
      }
      break;
    case "up":
      if (this.y + GridUtils.Y_CORRECTING_FACTOR - GridUtils.CELL_HEIGHT >= 0) {
        this.y -= GridUtils.CELL_HEIGHT;
      }
      if (this.y + GridUtils.Y_CORRECTING_FACTOR == 0) {
        const player = this;
        GridUtils.printMessage("Congrats, you won !");
        window.setTimeout(function() {
          player.goToStartPosition();
        }, 500);
      }
      break;
    case "down":
      if (
        this.y + GridUtils.CELL_HEIGHT <
        GridUtils.CANVAS_HEIGHT - GridUtils.Y_CORRECTING_FACTOR
      ) {
        this.y += GridUtils.CELL_HEIGHT;
      }
      break;
    default:
  }
};

Player.prototype.goToStartPosition = function() {
  this.y = GridUtils.positionYOfRow(5);
  this.x = GridUtils.positionXOfColumn(2);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var player = new Player();

// This adds a new ennemy each second
var interval = window.setInterval(function() {
  allEnemies.push(new Enemy());
  cleanOutOfBoundsEnemies();
}, 750);

function cleanOutOfBoundsEnemies() {
  let index = 0;
  for (enemy of allEnemies) {
    if (enemy.x > GridUtils.CANVAS_WIDTH) {
      enemy = null;
      allEnemies.splice(index, 1);
    }
  }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    32: "space",
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
