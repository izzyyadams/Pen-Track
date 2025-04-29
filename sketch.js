let penColor;
let ballColor;
let cursor;

function setup() {
  noCursor(); //hide standard cursor
  createCanvas(windowWidth, windowHeight);
  
  penColor = color(0, 173, 239); //blue
  ballColor = color(237, 0, 140); //pink


}

function preload(){
  cursor =  loadImage('data/cursor.png'); //load cursor image
}



function draw() {
  background(233, 224, 217);
  image(cursor, mouseX, mouseY); //draw cursor image at user's mouse

}

