const WIDTH = 987;
const HEIGHT = 673;

let backgroundImage;
let secondBackgroundImage;
let baseImage;
let manholl;
let dresik;
let dresik2;
let heroImage;
let obstacleNumber;
let doubleObstacleNumber;
let seagull;
let requestAnimationFrameId = 0;
let lastTime = 0;
let scoreTime = 0;
let isPlaying = false;
let isRankingOpen = false;
let animationSpeed = 6;
let startRandomNumber = 1;
let endRandomNumber = 4;
let obstacleShift = 500;

let scores = [];

let backgroundObj = {
  x: 0,
  y: 0,
  width: WIDTH,
  height: HEIGHT
};

let secondBackgroundObj = {
  x: 0,
  y: 0,
  width: WIDTH,
  height: HEIGHT
};

let baseObj = {
  x: 0,
  y: HEIGHT - 88,
  width: WIDTH,
  height: 88
};

let hero = {
  x: 100,
  y: HEIGHT - 200,
  height: 148,
  width: 144
};

let manhollObj = {
  x: 1100,
  y: HEIGHT - 88,
  width: 70,
  height: 31
};

let dresikObj = {
  x: 1100,
  y: HEIGHT - 138,
  width: 56,
  height: 90
};

let secondDresikObj = {
  x: 1700,
  y: HEIGHT - 138,
  width: 56,
  height: 90
};

let seagullObj = {
  x: 1100,
  y: HEIGHT / 2,
  width: 70,
  height: 40
};

let FRAME_X = 0;
let FRAME_Y = 0;
let frameCount = 0;

let jumpSpeed = 10;
let maxJumpHeight = 300;
let currentJumpHeight = 0;
let isHeroJumping = false;

const canvas = document.createElement("canvas");
canvas.setAttribute("height", `${HEIGHT}px`);
canvas.setAttribute("width", `${WIDTH}px`);
const body = document.querySelector("body");
body.append(canvas);
const ctx = canvas.getContext("2d");

function loadAllImages() {
  Promise.all([loadImage("background-day.png"), loadImage("background-day.png"), loadImage("base.png"), loadImage("manholl.png"), loadImage("dres2.png"), loadImage("dres3.png"), loadImage("running_man.png"), loadImage("mewa.png")]).then(values => {
    const [background, secondBackground, base, manhollLoad, dresikLoad, dresik2Load, hero, seagullLoad] = values;
    backgroundImage = background;
    secondBackgroundImage = secondBackground;
    baseImage = base;
    manholl = manhollLoad;
    dresik = dresikLoad;
    dresik2 = dresik2Load;
    heroImage = hero;
    seagull = seagullLoad;
  });
}

loadAllImages();

function loadImage(imageUrl) {
  const image = new Image();
  image.src = `assets/${imageUrl}`;
  return image;
}

function drawImage(image, x, y, width, height) {
  ctx.drawImage(image, x, y, width, height);
}

const pause = () => (isPlaying = false);

const play = () => (isPlaying = true);
const togglePause = () => {
  isPlaying = !isPlaying;
  closeRanking();
  instruction.style.display = "none";
};

AddScoreToRanking = () => {
  scores.push(Math.floor(Math.round(scoreTime / 1000)));
  let stringifiedScores = JSON.stringify(scores);
  localStorage.setItem("scores", stringifiedScores);
  console.log(localStorage);
};

const openRanking = () => {
  if (!isRankingOpen) {
    let bestScore = Math.max.apply(Math, scores);
    console.log(bestScore);

    scores = JSON.parse(localStorage.getItem("scores"));
    let ScoreList = document.querySelector("#ranking");
    ScoreList.innerHTML = "Twoje wyniki: ";

    for (let i = 0; i < scores.length; i++) {
      let paragraph = document.createElement("p");
      ScoreList.appendChild(paragraph);
      paragraph.innerHTML = "wynik nr " + [i + 1] + "_____" + scores[i] + '<img src="star.png">';

      if (scores[i] == bestScore) {
        paragraph.innerHTML = ("wynik nr " + [i + 1] + "_____" + scores[i] + '<img src="star2.png">').bold();
      }
    }
    if (scores.length >= 5) {
      scores = [];
    }

    closeInstruction();
    isRankingOpen = true;
    ranking.style.display = "block";
  }
};
const closeRanking = () => {
  if (isRankingOpen) {
    ranking.style.display = "none";

    isRankingOpen = false;
  }
};
const toggleRanking = () => {
  if (isRankingOpen) {
    closeRanking();

    play();
  } else {
    openRanking();
    pause();
  }
};
const closeInstruction = () => {
  instruction.style.display = "none";
  play();
};
const openInstruction = () => {
  lost.style.display = "none";
  button_start.style.display = "none";
  close_instruction.style.display = "block";
  instruction.style.display = "block";
  closeRanking();
  pause();
};

function countdown() {
  pause_button.removeEventListener("click", togglePause);
  instruction_button.removeEventListener("click", openInstruction);
  score_button.removeEventListener("click", toggleRanking);

  let timeleft = 3;
  document.getElementById("counter").hidden = false;
  let downloadTimer = setInterval(function() {
    timeleft--;
    document.getElementById("countdowntimer").textContent = timeleft;
    if (timeleft <= 0) clearInterval(downloadTimer);
  }, 1000);
}

const startGameButton = () => {
  closeInstruction();
  countdown();
  setTimeout(() => {
    counter.style.display = "none";
    pause_button.addEventListener("click", togglePause);
    instruction_button.addEventListener("click", openInstruction);
    score_button.addEventListener("click", toggleRanking);
    play();
  }, 3000);

  pause();
};

const pause_button = document.getElementById("pause_button");

const closeInstructionButton = document.getElementById("close_instruction");
closeInstructionButton.addEventListener("click", closeInstruction);
const instrucionWindow = document.getElementById("instruction");

const startButton = document.getElementById("button_start");
button_start.addEventListener("click", startGameButton);
document.getElementById("restart_button");
restart_button.addEventListener("click", restartGame);

const ranking = document.getElementById("ranking");

document.addEventListener("keydown", userPressedSpace);
canvas.addEventListener("click", userPressedMouse);

function heroJump() {
  currentJumpHeight += jumpSpeed;
  if (currentJumpHeight > maxJumpHeight) {
    hero.y = hero.y + jumpSpeed;
  } else {
    hero.y = hero.y - jumpSpeed;
  }

  if (currentJumpHeight > 2 * maxJumpHeight) {
    isHeroJumping = false;
    currentJumpHeight = 0;
    hero.y = HEIGHT - 200;
  }
}

let isOnGround = hero.y >= HEIGHT - 200;

function userPressedSpace(event) {
  spacePreesed = event.code === "Space";
  if (spacePreesed && isOnGround) {
    isHeroJumping = true;
  }
}
function userPressedMouse() {
  if (isOnGround) {
    isHeroJumping = true;
  }
}
function animateHero() {
  const IMAGE_WIDTH = 720;
  const IMAGE_HEIGHT = 740;
  const FRAME_WIDTH = IMAGE_WIDTH / 6;
  const FRAME_HEIGHT = IMAGE_HEIGHT / 5;

  ctx.drawImage(heroImage, FRAME_X * FRAME_WIDTH, FRAME_Y * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT, hero.x, hero.y, FRAME_WIDTH, FRAME_HEIGHT);
  if (frameCount < 2) {
    return;
  }
  if (isHeroJumping) {
    heroJump();
  }
  if (!isHeroJumping) {
    heroMovement();
  }
}

function heroMovement() {
  frameCount = 0;
  if (FRAME_X < 5) {
    FRAME_X++;
  } else {
    FRAME_X = 0;
    if (FRAME_Y < 4) {
      FRAME_Y++;
    } else {
      FRAME_Y = 0;
    }
  }
}

getRandomNumberForSingleObstacle();
getRandomNumberForDoubleObstacle();

function drawObscale(wchichOne) {
  if ((wchichOne = 1)) {
    drawSingleObstacle(obstacleNumber);
  } else if ((wchichOne = 2)) {
  }
}

function loop(time) {
  frameCount++;
  lastTime = time;
  if (isPlaying) {
    scoreTime += 16;

    timer.innerHTML = "twój obecny wynik to: " + Math.floor(Math.round(scoreTime / 1000)) + '<img src="star.png">';
    difficultLevel(scoreTime);
    drawBackground();
    drawImage(baseImage, baseObj.x, baseObj.y, baseObj.width, baseObj.height);
    animateHero();
    animateBackground(backgroundObj);
    animateBackground(secondBackgroundObj);
    drawSingleObstacle(obstacleNumber);
  }
  requestAnimationFrameId = requestAnimationFrame(loop);
}

function startGame() {
  close_instruction.style.display = "none";
  loop(lastTime);
}

function restartBackgroundPosition() {
  let backgroundObiectsArray = [backgroundObj, secondBackgroundObj, baseObj];
  backgroundObiectsArray.forEach(object => (object.x = 0));
}

function restartObstaclePosition() {
  let obstacleObjectArray = [manhollObj, dresikObj, seagullObj];
  obstacleObjectArray.forEach(object => (object.x = 1100));
}

function restartGame() {
  AddScoreToRanking();
  cancelAnimationFrame(requestAnimationFrameId);
  frameCount = 0;
  isPlaying = true;
  lastTime = 0;
  scoreTime = 0;
  animationSpeed = 6;
  startRandomNumber = 1;
  endRandomNumber = 4;
  FRAME_X = 0;
  FRAME_Y = 0;
  secondDresikObj.x = 1700;
  restartBackgroundPosition();
  restartObstaclePosition();
  getRandomNumberForSingleObstacle();
  pause_button.style.display = "block";
  lost.style.display = "none";

  startGame();
}

startGame();

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomNumberForSingleObstacle() {
  obstacleNumber = randomNumber(startRandomNumber, endRandomNumber);
}

function getRandomNumberForDoubleObstacle() {
  doubleObstacleNumber = randomNumber(1, 3);
}

function drawBackground() {
  drawImage(backgroundImage, backgroundObj.x, backgroundObj.y, backgroundObj.width, backgroundObj.height);
  drawImage(secondBackgroundImage, secondBackgroundObj.x + WIDTH, secondBackgroundObj.y, secondBackgroundObj.width, secondBackgroundObj.height);
}

function drawSingleObstacle(obstacleNumber) {
  switch (obstacleNumber) {
    case 1:
      drawImage(manholl, manhollObj.x, manhollObj.y, manhollObj.width, manhollObj.height);
      animateObstacle(manhollObj);
      collision(manhollObj);

      break;
    case 2:
      drawImage(dresik, dresikObj.x, dresikObj.y, dresikObj.width, dresikObj.height);
      animateObstacle(dresikObj);
      collision(dresikObj);
      break;
    case 3:
      drawImage(dresik2, dresikObj.x, dresikObj.y, dresikObj.width, dresikObj.height);
      animateObstacle(dresikObj);
      collision(dresikObj);
      break;
    case 4:
      drawImage(seagull, seagullObj.x, seagullObj.y, seagullObj.width, seagullObj.height);
      animateObstacle(seagullObj);
      collision(seagullObj);
      break;
    case 5:
      drawImage(dresik2, dresikObj.x, dresikObj.y, dresikObj.width, dresikObj.height);
      drawImage(manholl, manhollObj.x - 80, manhollObj.y + 20, manhollObj.width, manhollObj.height);
      animateObstacle(dresikObj);
      animateObstacle(manhollObj);
      collisionDoubleObject(manhollObj, dresikObj);
      break;
    case 6:
      drawDoubleObstacle(doubleObstacleNumber);
      break;
    default:
      break;
  }
}

function drawDoubleObstacle(doubleObstacleNumber) {
  switch (doubleObstacleNumber) {
    case 1:
      drawImage(manholl, manhollObj.x, manhollObj.y, manhollObj.width, manhollObj.height);
      drawImage(dresik, secondDresikObj.x, secondDresikObj.y, secondDresikObj.width, secondDresikObj.height);
      animateDoubleObstacle(manhollObj, secondDresikObj);
      collisionDoubleObject(manhollObj, secondDresikObj);
      break;
    case 2:
      drawImage(seagull, seagullObj.x, seagullObj.y, seagullObj.width, seagullObj.height);
      drawImage(dresik, secondDresikObj.x, secondDresikObj.y, secondDresikObj.width, secondDresikObj.height);
      animateDoubleObstacle(seagullObj, secondDresikObj);
      collisionDoubleObject(seagullObj, secondDresikObj);
      break;
    case 3:
      drawImage(dresik2, dresikObj.x, dresikObj.y, dresikObj.width, dresikObj.height);
      drawImage(dresik, secondDresikObj.x, secondDresikObj.y, secondDresikObj.width, secondDresikObj.height);
      animateDoubleObstacle(dresikObj, secondDresikObj);
      collisionDoubleObject(dresikObj, secondDresikObj);
      break;
    default:
      break;
  }
}

function animateBackground(imageObject) {
  imageObject.x -= 3;

  if (imageObject.x < -WIDTH) {
    imageObject.x = 0;
    imageObject.x -= 1;
  }
}

function animateObstacle(obstacleObject) {
  obstacleObject.x -= animationSpeed;
  if (obstacleObject.x < -100) {
    obstacleObject.x = 1100;
    getRandomNumberForSingleObstacle();
  }
}

function collision(enemy) {
  if (hero.x < enemy.x + enemy.width - 25 && hero.x + hero.width - 65 > enemy.x && hero.y < enemy.y + enemy.height && hero.y + hero.height > enemy.y) {
    pause();

    lost.style.display = "block";
    if ((lost.style.display = "block")) {
      //po co ten iffff????
      pause_button.style.display = "none";
    }
  }
}

function animateDoubleObstacle(firstObstacleObject, secondObstacleObject) {
  firstObstacleObject.x -= animationSpeed;
  secondObstacleObject.x -= animationSpeed;
  if (firstObstacleObject.x < -firstObstacleObject.width && secondObstacleObject.x < -secondObstacleObject.width) {
    firstObstacleObject.x = 1100;
    secondObstacleObject.x = 1700;
    getRandomNumberForDoubleObstacle();
    getRandomNumberForSingleObstacle();
  }
}

function collisionDoubleObject(firsteEnemy, secondEnemy) {
  if (
    (hero.x < firsteEnemy.x + firsteEnemy.width - 25 &&
    hero.x + hero.width - 65 > firsteEnemy.x && //czo to 65 i 25???
      hero.y < firsteEnemy.y + firsteEnemy.height &&
      hero.y + hero.height > firsteEnemy.y) ||
    (hero.x < secondEnemy.x + secondEnemy.width - 25 && hero.x + hero.width - 65 > secondEnemy.x && hero.y < secondEnemy.y + secondEnemy.height && hero.y + hero.height > secondEnemy.y)
  ) {
    pause();
    lost.style.display = "block";
    if ((lost.style.display = "block")) {
      //po co ten iffff????
      pause_button.style.display = "none";
    }
  }
}

function difficultLevel(timeS) {
  timeLevel = timeS / 1000;
  if (timeLevel > 15 && timeLevel < 16) {
    animationSpeed = 9;
  } else if (timeLevel > 20 && timeLevel < 21) {
    startRandomNumber = 5;
    endRandomNumber = 6;
  }
}
