

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
let loserSwitch;
let levelButtons = [];


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



function setup() {
  noCursor(); //hide standard cursor
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i <  2; i++ ){
    for ( let j = 0; j < 3; j ++ ) {
      levelButtons.push(new levelButton(windowWidth/4 + (200 *j), windowHeight/2 + (i * 200), i* 3 + j + 1));
    }
  }

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
  


}

function preload(){
  cursor =  loadImage('data/cursor.png'); //load cursor image
  mainFont = loadFont('data/Jua-Regular.ttf'); //loading font
}



function draw() {
  background(backgroundColor);
  if (startScreenSwitch){
    startScreen();
  }

  if (levelSelectSwitch){
    levelSelect();
  }

  if (level1Switch) {
    level();
  }
  image(cursor, mouseX - 20, mouseY); //draw cursor image at user's mouse
  
  

}

function mouseDragged(){
  //mouseDragged works while button is pressed and mouse is moving
  //pushes mouse's coordinates onto array an array
  //general strategy of having the mouse draw used from class, but I am not directly looking at the code while wriitng this
  if(hasInk){
    coordinates.push({x: mouseX, y: mouseY}); 
    
  }
}

function ballStart() {
  fill(ballColor);
  stroke(ballColor);
  circle(origBallX, origBallY, ballSize);
}

function ballDrop() {
  //I watched the Coding Train Nature of Code to help me understand vectors, but didn't directly use code
  //any upwards forces caused by path
  for(let i = 0; i < coordinates.length - 1; i++){
    //strategy is to make a line segment between each point, find the point on this line segment that ball is closest too, and then see if they collide
    let point1 = createVector(coordinates[i].x, coordinates[i].y); //create a vector for the point at 1
    let point2 = createVector(coordinates[i+1].x, coordinates[i+1].y); //create a vector for the point next to i
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
  win = flagCrossed(prevPosition, position, createVector(startX, startY), createVector(startX, poleHeight));

  

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
  return sidePrev * sideCurr < 0; 
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
  pen(500);
  if (drop) {
    start = false;
    ballDrop(); 
  }
  if(start){
    ballStart();
    drop = false;
  }

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

function level() {
  pen(200);
  if(win) { 
    drawingFlag = false;
  }
  if (drawingFlag){
    drawFlag(windowWidth - 300, windowHeight -300);
  }
  //switches for when the ball drops
  if (drop) {
    start = false;
    ballDrop();  
  }
  if(start){
    ballStart();
    drop = false;
  }
}

function won () {

}

function lost() {

}


function mouseClicked() {
  let goToLevel = 0;

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
    coordinates = [];
    drop = false;
    start = true;
    level1Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 2) {
    level2Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 3) {
    level3Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 4) {
    level4Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 5) {
    level5Switch = true;
    levelSelectSwitch = false;
  }

  if (goToLevel == 6) {
    level6Switch = true;
    levelSelectSwitch = false;
  }

}