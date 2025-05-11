

let penColor;
let ballColor;
let poleColor;
let flagColor;
let cursor;
let coordinates;
let strokeSize;
let start;
let drop;
let ballSize;
let hasInk;
let acceleration;
let velocity;
let position;
let gravity;
let origBallX;
let origBallY;
let indexOfBall;
let upwardForce;
let backgroundColor;
let win;
let prevPosition;
let drawingFlag;
let mainFont;
let startScreenSwitch;
let levelSelectSwitch;
let level1Switch;
let level2Switch;
let level3Switch;
let level4Switch;
let level5Switch;
let level6Switch;
let winnerSwitch;
let levelButtons = [];
let restartImage;
let restartScreenSwitch1;
let restartScreenSwitch2;
let restartScreenSwitch3;
let restartScreenSwitch4;
let restartScreenSwitch5;
let restartScreenSwitch6;
let homeImage;
let winSound;
let soundPlayed;
let startTime;
let level1Inputs;
let level2Inputs;
let level3Inputs;
let winds = [];
let windSound;
let windSoundPlayed;
let level4Inputs;
let level5Inputs;
let noDrawZones = [];
let level6Inputs;



class levelButton {
  constructor(x, y, level) {
    this.x = x;
    this.y = y;
    this.level = level;
  }

  display() {
    stroke(0, 0, 0);
    strokeWeight(3);
    fill(249, 238, 228);
    rectMode(CENTER);
    rect(this.x, this.y, 50, 100, 20);
    noStroke();
    fill(ballColor);
    textAlign(CENTER, CENTER);
    textSize(32);
    text(this.level, this.x, this.y);
  }
}

class windStreak {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.lengthy = random(10,25);
    this.speed = random(0.5, 3);
  }

  display() {
    stroke(141, 153, 174); 
    strokeWeight(3);
    line(this.x, this.y, this.x+this.lengthy, this.y);
  }

  update() {
    this.x -= this.speed;
    if (this.x > windowWidth + this.lengthy) {
      this.x = -this.lengthy;
    }
    if (this.x < -this.lengthy) {
      this.x = windowWidth + this.lengthy;
    }


  }
}

class noDrawingZone {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  display() {
    fill(255, 0, 0, 128);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
  }
}


function setup() {
  noCursor(); //hide standard cursor
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 10; i++) {
    winds.push(new windStreak);
  }

let rows = 2; 
let cols = 3;
let spacing = 200; // spacing horizontally and vertically between level boxes

let gridWidth = (cols - 1) * spacing; //need this to not hard code coorindates
let gridHeight = (rows - 1) * spacing;

let startX = windowWidth / 2 - gridWidth / 2; //center of screen minus half the width of the grid is the starting point for it to be centered
let startY = windowHeight / 2 - gridHeight / 2;

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let x = startX + j * spacing; //column spacing
    let y = startY + i * spacing; //row spacing
    let levelNum = i * cols + j + 1; //index of level +1 because indexing starts at 0
    levelButtons.push(new levelButton(x, y, levelNum));
  }
}

noDrawZones.push(new noDrawingZone(windowWidth/2, windowHeight/2, 140, windowHeight));
noDrawZones.push(new noDrawingZone(windowWidth/4, windowHeight/2, 100, windowHeight));
noDrawZones.push(new noDrawingZone(windowWidth/4 * 2, windowHeight/2, 100, windowHeight));
noDrawZones.push(new noDrawingZone(windowWidth/2, windowHeight/2, 75, windowHeight))

  startScreenSwitch = true;


  win = false;

  backgroundColor = color(233, 224, 217); //off-white
  penColor = color(0, 173, 239); //blue
  ballColor = color(237, 0, 140); //pink
  poleColor = color(139, 94, 59); //brown
  flagColor = color(5, 166, 81); //green
  coordinates = []; //array to store mouse x and y coordinates in {} (since no tuples in js)
  strokeSize = 20; //pen stroke
  start = true; //ball should start in starting position
  drop = false; //ball shouldn't fall until later
  ballSize = 30; //size of ball
  hasInk = true; //start with ink to use
  origBallX = windowWidth/8; //ball starting point
  origBallY = windowHeight/3;
  position = createVector(origBallX, origBallY); // initial ball position
  velocity = createVector(0,0); //no movement to begin
  acceleration = createVector(0,0); //no movement to begin
  gravity = createVector(0, 0.2); // no x change, but y has downward force
  indexOfBall = 0; //will be used to see if ball is hitting path
  upwardForce = createVector(0, 0.2); //resulting from drawn line
  prevPosition = position.copy();
  drawingFlag = true;
  level1Switch = false;
  level2Switch = false;
  level3Switch = false;
  level4Switch = false;
  level5Switch = false;
  level6Switch = false;
  restartScreenSwitch1 = false;
  restartScreenSwitch2 = false;
  restartScreenSwitch3 = false;
  restartScreenSwitch4 = false;
  restartScreenSwitch5 = false;
  restartScreenSwitch6 = false;
  soundPlayed = false;
  startTime = 0;
  level1Inputs = [windowWidth/8, windowHeight/4, (windowWidth/8)*6, (windowHeight/4)*3, 250, 0];
  level2Inputs = [(windowWidth/8)*3, windowHeight/3, (windowWidth/8)*5, (windowHeight/8)*3.1, 100, 0];
  level3Inputs = [(windowWidth/8)*2, windowHeight/3, (windowWidth/8)*5.5, (windowHeight/4)*3.5, 250, 0.07];
  level4Inputs = [(windowWidth/8)*2, windowHeight/3, (windowWidth/8)*5.5, (windowHeight/4)*3.5, 250, 0];
  level5Inputs = [windowWidth/9, windowHeight/4, (windowWidth/8)*6, (windowHeight/4)*3.5, 250, 0];
  level6Inputs = [windowWidth/4, windowHeight/4, (windowWidth/8)*5, (windowHeight/4)*3.5, 250, 0.06];

  winnerSwitch = false;
  windSoundPlayed = false;



}

function preload(){
  cursor =  loadImage('data/cursor.png'); //load cursor image
  mainFont = loadFont('data/Jua-Regular.ttf'); //loading font
  restartImage = loadImage('data/restart.png');
  homeImage = loadImage('data/house.png');
  winSound = loadSound('data/winSound.mp3');
  windSound = loadSound('data/wind.mp3');
}



function draw() {
  background(backgroundColor);

  if (restartScreenSwitch1) {
    restartScreen(level1Inputs[0], level1Inputs[1]);
    restartScreenSwitch1 = false;
  }
  if (restartScreenSwitch2) {
    restartScreen(level2Inputs[0], level2Inputs[1]);
    restartScreenSwitch2 = false;
  }
  if (restartScreenSwitch3) {
    restartScreen(level3Inputs[0], level3Inputs[1]);
    restartScreenSwitch3 = false;
  }
  if (restartScreenSwitch4) {
    restartScreen(level4Inputs[0], level4Inputs[1]);
    restartScreenSwitch4 = false;
  }
  if (restartScreenSwitch5) {
    restartScreen(level5Inputs[0], level5Inputs[1]);
    restartScreenSwitch5 = false;
  }
  if (restartScreenSwitch6) {
    restartScreen(level6Inputs[0], level6Inputs[1]);
    restartScreenSwitch6 = false;
  }

  if (startScreenSwitch){
    startScreen();
  }

  if (levelSelectSwitch){
    levelSelect();
  }

  if (level1Switch) {
    level1();
  }
  if (level2Switch) {
    level2();
  }

  if (level3Switch) {
    level3();
  }

  if(level4Switch) {
    level4();
  }

  if(level5Switch) {
    level5();
  }

  if(level6Switch) {
    level6();
  }
  

  if (winnerSwitch) {
    won();
    
    elapsedTime = (millis() - startTime) /1000;
    if (elapsedTime >= 3) {
      levelSelectSwitch = true;
      winnerSwitch = false;
      win = false;
    }

  }
  image(cursor, mouseX - 20, mouseY); //draw cursor image at user's mouse
  
  

}

function mouseDragged(){
  //mouseDragged works while button is pressed and mouse is moving
  //pushes mouse's coordinates onto array an array
  //general strategy of having the mouse draw used from class, but I am not directly looking at the code while wriitng this
  if (level4Switch){
    if (
      mouseX > noDrawZones[0].x - (noDrawZones[0].width/2) &&
      mouseX < noDrawZones[0].x + (noDrawZones[0].width/2)
      
    ) {
      return; 
    }

    if(hasInk){
      coordinates.push({x: mouseX, y: mouseY}); 
      
    }
  }else if(level5Switch){
    if (
     (mouseX > noDrawZones[1].x - (noDrawZones[1].width/2) &&
      mouseX < noDrawZones[1].x + (noDrawZones[1].width/2)) || (mouseX > noDrawZones[2].x - (noDrawZones[2].width/2) &&
      mouseX < noDrawZones[2].x + (noDrawZones[2].width/2))
      
    ) {
      return; 
    }

    if(hasInk){
      coordinates.push({x: mouseX, y: mouseY}); 
      
    }
  }else if(level6Switch){
    if(
    mouseX > noDrawZones[3].x - (noDrawZones[3].width/2) &&
    mouseX < noDrawZones[3].x + (noDrawZones[3].width/2)
    ) {
      return;
    }
    if(hasInk){
      coordinates.push({x: mouseX, y: mouseY}); 
      
    }
  }else{
    if(hasInk){
      coordinates.push({x: mouseX, y: mouseY}); 
      
    }
  }
}

function ballStart(ballX, ballY) {
  fill(ballColor);
  stroke(ballColor);
  circle(ballX, ballY, ballSize);
}

function ballDrop(wind) {
  //I watched the Coding Train Nature of Code to help me understand vectors, but didn't directly use code
  //any upwards forces caused by path
  for(let i = 0; i < coordinates.length - 1; i++){
    //strategy is to make a line segment between each point, find the point on this line segment that ball is closest too, and then see if they collide
    let point1 = createVector(coordinates[i].x, coordinates[i].y); //create a vector for the point at 1
    let point2 = createVector(coordinates[i+1].x, coordinates[i+1].y); //create a vector for the point next to i
    if (point1.dist(point2) > 50) continue;
    let lineSegment = point2.copy().sub(point1); //vector between point 1 and point 2
    let distanceToLine = position.copy().sub(point1); //used to find where the ball is relative to the first point of the line segment
    //scalar projection formula: (a dot b) / magnitude of b 
    let scalarProjection = distanceToLine.dot(lineSegment) / lineSegment.magSq(); //scalar projection of the ball onto the line segment to see where exactly on the line segment it falls
    scalarProjection = constrain(scalarProjection, 0, 1); // makes sure closest point is on the line segment just created
    let closestPoint = point1.copy().add(lineSegment.mult(scalarProjection)); //finding closest point on the line to the ball. start at point 1, and move correct percentage between 0 and 1 from t to point 1. if scalarProjection is 0.5, move halfway between point1 and point 2
    let distance = position.dist(closestPoint); // find balls distance from this point
    if (distance < ballSize) { //if colliding with point
      acceleration.sub(upwardForce); //acceleration gains an upwards force from the line
      //also need to calculate sliding force down the line
      let lineSegmentDirection = lineSegment.copy().normalize(); //gets only the direction of the line segement between point1 and point2
      let slidingForce = lineSegmentDirection.mult(gravity.dot(lineSegmentDirection)); //projecting gravity onto direction of the line segment to have it push down and to the side downt the line instead of just down
      acceleration.add(slidingForce);


      //the shortest vector that can separate two colliding objects so ball doesn't go into line
      //i used this video for basic concept, but not code since it was about when morethan one object could move
      //https://youtu.be/9IULfQH7E90?feature=shared 1:00 - 1:20
      //direction from line point to center of ball
      let normalSurface = position.copy().sub(closestPoint);
      //magnitude one, only care about direction
      let unitNormalSurface = normalSurface.normalize();
      //scale by penetration so it pushes out same amount it entered the line by
      let pushBack = unitNormalSurface.mult(ballSize - distance);
      //pushes ball back out of line so it doesn't keep colliding and looks more normal
      position.add(pushBack);
    }
  }
  
  let windVector = createVector(-wind, 0);
  acceleration.add(windVector);

  acceleration.add(gravity); //ball acclerates due to gravity
  velocity.add(acceleration); //ball's speed changes based on accleration
  velocity.mult(0.99); //air resistance OR path resitance, velocity would naturally slow down over time
  prevPosition = position.copy();
  position.add(velocity); //ball's position changes by its velocity
  acceleration.mult(0); // otherwise acceleration will increase with each frame
  fill(ballColor);
  stroke(ballColor);
  circle(position.x, position.y, ballSize); //draws ball at correct position

}

function pen(inkLimit) {
  inkContainer(inkLimit);
  stroke(penColor);
  strokeWeight(strokeSize);
  //iterates through x and y coordinate array and draws point at each coordinate
  for (let i = 0; i < coordinates.length; i ++) {
    point(coordinates[i].x, coordinates[i].y);
  }
  if (coordinates.length > inkLimit) { //stop drawing when run out of ink
    hasInk = false;
  }

}

function mouseReleased() {
  drop = true; //once the user releases the mouse, ball should drop
}

function drawFlag(startX, startY) {
  let poleHeight = startY - 125;
  noFill();
  stroke(poleColor);
  strokeWeight(25);
  line(startX, startY, startX, poleHeight);
  stroke(flagColor);
  triangle(startX, poleHeight, startX, poleHeight + 25, startX + 50, poleHeight + 12);


  //CHECK IF BALL CROSSES
  win = flagCrossed(prevPosition, position, createVector(startX, startY + 50), createVector(startX, poleHeight));

  

}

function inkContainer(inkLimit) {
  let containerHeight =  100;
  let containerWidth = 30;
  let containerX = mouseX + 50;
  let containerY = mouseY + 75;
  let inkHeight = containerHeight - ((coordinates.length)/inkLimit) * containerHeight; //full height to start, subtract by comparing used ink to ink limit times the full height
  stroke(0,0,0);
  strokeWeight(5);
  fill(backgroundColor);
  //draw rect same color as background for emoy container
  rectMode(CORNER);
  rect(containerX, containerY, containerWidth, containerHeight, 20);
  if (hasInk) {
    //if there is ink left (avoid drawing empty rectangle)
    strokeWeight(2);
    fill(penColor);
    //starting corner should move down as ink is lost
    rect(containerX, containerY + ((coordinates.length)/inkLimit) * containerHeight, containerWidth, inkHeight, 20);
  }



}



function flagCrossed(prevPosition, currentPosition, point1, point2) {
  // find which of line ball was on previously
  let pole = point2.copy().sub(point1); //vector of flag pole
  let prevBallToPole = prevPosition.copy().sub(point1); //vector from ball's previous position to flagpole
  //cross product gives rotation
  let sidePrev = pole.x * prevBallToPole.y - pole.y * prevBallToPole.x; //only need positive or negative to show one side of the line or the other
  //line of vector points opposite direction once line is passed

  // find which of line ball was on now
  let postBallToPole = currentPosition.copy().sub(point1);
  let sideCurr = pole.x * postBallToPole.y - pole.y * postBallToPole.x;

  // sign changed = crossed
  let lineCrossed = sidePrev * sideCurr < 0; 

  //this checks if it crosses a line going across the entire height of the screen, but we need to make sure the y is limited
  //perform the same test as above but horizontally to see if the top of the flag and the bottom of the flag are on opposite sides of the ball
  let ballsMovement = currentPosition.copy().sub(prevPosition); //vector from previous to current ball position
  let prevToTop = point1.copy().sub(prevPosition); //previous position posotion to top point of flag
  let prevToBottom = point2.copy().sub(prevPosition); //previous position posotion to bottom point of flag
  let inA = ballsMovement.x * prevToTop.y - ballsMovement.y * prevToTop.x; //should be pointing up to top
  let inB = ballsMovement.x * prevToBottom.y - ballsMovement.y * prevToBottom.x; //should be pointing down to bottom

  let segementsCross = inA * inB < 0; //if oppsoite then must be inbetween the 2 points (in the flag segment)


  return lineCrossed && segementsCross;
}

function restartScreen(origBallX, origBallY) {
  position = createVector(origBallX, origBallY); 
  velocity = createVector(0,0); 
  acceleration = createVector(0,0);
  coordinates = [];
  win = false;
  drop = false;
  drawingFlag = true;
  start = true;
  hasInk = true;
  soundPlayed = false;

}


//function for start screem
function startScreen() {
  textFont(mainFont);
  textAlign(CENTER, CENTER);
  let postitColor = color(247, 242, 181); //yellow
  noStroke();
  fill(postitColor);
  rectMode(CENTER);
  rect(windowWidth/2, (windowHeight/10)* 7, 200, 200);
  textSize(48);
  fill(ballColor);
  text("START", windowWidth/2, (windowHeight/10)* 7);

  noStroke();
  fill(penColor);
  textSize(96);
  text("Drawn Conclusion", windowWidth/2, windowHeight/4);
  //allows for user to use the pen and see the ball drop on start screen
  // // pen(500);
  // // if (drop) {
  // //   start = false;
  // //   ballDrop(0); 
  // // }
  // // if(start){
  // //   ballStart();
  // //   drop = false;
  // // }

}


function levelSelect() {
  textSize(64);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(penColor);
  text("Select a Level", windowWidth/2, windowHeight/10);

  for (let i = 0; i < levelButtons.length; i++ ) {
    levelButtons[i].display();
  }

}

function level1() {
  level(level1Inputs[0], level1Inputs[1], level1Inputs[2], level1Inputs[3], level1Inputs[4], level1Inputs[5]);

}

function level2() {
  level(level2Inputs[0], level2Inputs[1], level2Inputs[2], level2Inputs[3], level2Inputs[4], level2Inputs[5]);
}

function level3() {
  level(level3Inputs[0], level3Inputs[1], level3Inputs[2], level3Inputs[3], level3Inputs[4], level3Inputs[5]);
}

function level4() {
  noDrawZones[0].display();
  level(level4Inputs[0], level4Inputs[1], level4Inputs[2], level4Inputs[3], level4Inputs[4], level4Inputs[5]);

}

function level5() {
  noDrawZones[1].display();
  noDrawZones[2].display();
  level(level5Inputs[0], level5Inputs[1], level5Inputs[2], level5Inputs[3], level5Inputs[4], level5Inputs[5]);
}

function level6() {
  noDrawZones[3].display();
  level(level6Inputs[0], level6Inputs[1], level6Inputs[2], level6Inputs[3], level6Inputs[4], level6Inputs[5]);
}

function level(ballX, ballY, flagX, flagY, inkLimit, wind) {
  if (wind > 0) {
    for (let i = 0; i < winds.length; i ++ ) {
      winds[i].display();
      winds[i].update();
      
    }
    if (!windSoundPlayed) {
      windSound.loop();
    }
    windSoundPlayed = true;
  }
  image(restartImage, windowWidth - 75, 25, 50, 50);
  image(homeImage, 50, 25, 50, 50)
  pen(inkLimit);
  
  

  //switches for when the ball drops
  if (drop) {
    start = false;
    ballDrop(wind);  
  }
  if(start){
    ballStart(ballX, ballY);
    drop = false;
  }

  if (drawingFlag){
    drawFlag(flagX, flagY);
  }

  if(win & !soundPlayed) { 
    startTime = millis();
    winSound.play();
    soundPlayed = true;
    drawingFlag = false;
    winnerSwitch = true;
    level1Switch = false;
    level2Switch = false;
    level3Switch = false;
    level4Switch = false;
    level5Switch = false;
    level6Switch = false;
    windSound.stop();
  } 
}

function won () {
  background(flagColor);
  noStroke();
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text("YOU WON!", windowWidth/2, windowHeight/3);
  

}



function mouseClicked() {
  let goToLevel = 0;
  if (!startScreenSwitch){
   if (dist(mouseX, mouseY, windowWidth - 75, 25) < 50) {
    if (level1Switch){
     restartScreenSwitch1 = true;
    }
    if (level2Switch){
     restartScreenSwitch2 = true;
    }
    if (level3Switch){
     restartScreenSwitch3 = true;
    }
    if (level4Switch){
     restartScreenSwitch4 = true;
    }
    if (level5Switch){
     restartScreenSwitch5 = true;
    }
    if (level6Switch){
     restartScreenSwitch6 = true;
    }
   }
   if (dist(mouseX, mouseY, 50, 25) < 50) {
     levelSelectSwitch = true;
     level1Switch = false;
     level2Switch = false;
     level3Switch = false;
     level4Switch = false;
     level5Switch = false;
     level6Switch = false;
     windSound.stop();
   }
  }

  //for changing from start screen when start button is pressed
  let postitX = windowWidth/2;
  let postitY = (windowHeight/10) * 7;
  if (startScreenSwitch) {
    if ((mouseX > (postitX - 100) && (mouseX < postitX + 100))) {
      if ((mouseY > postitY - 100) && (mouseY < postitY + 100)) {
        levelSelectSwitch = true;
        startScreenSwitch = false;
      }
    }
  }


  if  (levelSelectSwitch) {
    for (let i = 0; i < levelButtons.length; i ++) {
      if ((mouseX > levelButtons[i].x - 25) && (mouseX < levelButtons[i].x + 25)) {
        if ((mouseY > levelButtons[i].y -50) && (mouseY < levelButtons[i].y + 50)) {
          goToLevel = levelButtons[i].level;
        }
      }   
    }
  }

  if (goToLevel == 1) {
    restartScreenSwitch1 = true;
    level1Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 2) {
    restartScreenSwitch2 = true;
    level2Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 3) {
    restartScreenSwitch3 = true;
    level3Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 4) {
    restartScreenSwitch4 = true;
    level4Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 5) {
    restartScreenSwitch5 = true;
    level5Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 6) {
    restartScreenSwitch6 = true;
    level6Switch = true;
    levelSelectSwitch = false;
  }

}


