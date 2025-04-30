let penColor;
let ballColor;
let cursor;
let coordinates;
let strokeSize;
let start;
let drop;
let ballSize;
let hasInk;
let inkLimit;
let acceleration;
let velocity;
let position;
let gravity;
let origBallX;
let origBallY;
let indexOfBall;
let upwardForce;


function setup() {
  noCursor(); //hide standard cursor
  createCanvas(windowWidth, windowHeight);
  
  penColor = color(0, 173, 239); //blue
  ballColor = color(237, 0, 140); //pink
  coordinates = []; //array to store mouse x and y coordinates in {} (since no tuples in js)
  strokeSize = 20; //pen stroke
  start = true; //ball should start in starting position
  drop = false; //ball shouldn't fall until later
  ballSize = 30; //size of ball
  hasInk = true; //start with ink to use
  inkLimit = 300; //most ink you can use
  origBallX = windowWidth/8; //ball starting point
  origBallY = windowHeight/3;
  position = createVector(origBallX, origBallY); // initial ball position
  velocity = createVector(0,0); //no movement to begin
  acceleration = createVector(0,0); //no movement to begin
  gravity = createVector(0, 0.2); // no x change, but y has downward force
  indexOfBall = 0; //will be used to see if ball is hitting path
  upwardForce = createVector(0, 0.2); //resulting from drawn line


}

function preload(){
  cursor =  loadImage('data/cursor.png'); //load cursor image
}



function draw() {
  background(233, 224, 217);
  pen();
  image(cursor, mouseX - 20, mouseY); //draw cursor image at user's mouse
  
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

function mouseDragged(){
  //mouseDragged works while button is pressed and mouse is moving
  //pushes mouse's coordinates onto array an array
  //general strategy of having the mouse draw used from class, but I am not directly looking at the code while wriitng this
  if(hasInk){
    coordinates.push({x: mouseX, y: mouseY}); 
    if (coordinates.length > inkLimit) { //stop drawing when run out of ink
      hasInk = false;
    }
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
    }
  }
  


  acceleration.add(gravity); //ball acclerates due to gravity
  velocity.add(acceleration); //ball's speed changes based on accleration
  position.add(velocity); //ball's position changes by its velocity
  acceleration.mult(0); // otherwise acceleration will increase with each frame
  fill(ballColor);
  stroke(ballColor);
  circle(position.x, position.y, ballSize); //draws ball at correct position

}

function pen() {
  stroke(penColor);
  strokeWeight(strokeSize);
  //iterates through x and y coordinate array and draws point at each coordinate
  for (let i = 0; i < coordinates.length; i ++) {
    point(coordinates[i].x, coordinates[i].y);
  }

}

function mouseReleased() {
  drop = true; //once the user releases the mouse, ball should drop
}