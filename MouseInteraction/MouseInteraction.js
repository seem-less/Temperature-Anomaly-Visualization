//Made by Waseem Girach
//waseem-g.com/portfolio
//https://www.linkedin.com/in/waseemgirach/

//NOAA National Centers for Environmental information, Climate at a Glance: Global Time Series,
//published May 2018, data retrieved on May 27, 2018 from http://www.ncdc.noaa.gov/cag/

//This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License

var tempAn;
var list;
var x;
var spectrum;
var spectrumInt;
var spectrumIntPrev;
var label;
var value;
var mag;
var magPrev;
var v1;
var v2;
var url;
var fontUrl;
var font;
var circleOd = 450;
var circleMd = 350;
var circleId = 300;
//var colDif = ((circleOd/2 - circleId/2)/3) + circleId;


function preload(){
  url = "https://www.openprocessing.org/sketch/553781/files/tempadjust.json";
  tempAn = loadJSON(url);
  //fontUrl = "C:/Users/seem/Documents/Programming/P5js-Examples/Creative Technologies Examples/Data visualization Project/fonts/Orbitron/Orbitron-Regular.ttf";
  //font = loadFont(fontUrl);
}


function setup(){
    createCanvas(1250,530);
    translate(width/2, height/2);
}

function draw(){
  background(255);
  translate(width/2, height/2);
  strokeWeight(4);
  fill(255);
  stroke(255,0,0);
  ellipse(0, 0, circleOd);
  stroke(255);
  ellipse(0, 0, circleMd);
  stroke(0,0,255);
  ellipse(0, 0, circleId);

  label = Object.keys(tempAn); //Label is an array
  value = Object.values(tempAn); //Value is an array

  // PRINTING THE MIN AND MAX VALUES OF THE DATA OBJECT
  // var min = Math.min.apply(null, value);
  // var max = Math.max.apply(null, value);
  // print(min+ " " +max);

  spectrum = map(mouseX, 0, width, 0, 137);
  spectrumInt = parseInt(spectrum);
  //print(mag);
  if (mouseX < width && mouseX > 0){
        push();
        fill(255);
        rectMode(CENTER);
        noStroke();
        rect(0, 270, 70, 30);
        textSize(32);
        textAlign(CENTER);
        stroke(0);
        strokeWeight(1);
				fill(0)
        text(label[spectrumInt], 0, 260);
        pop();

    for (var i = 0; i <= spectrumInt; i++){
      // noStroke();
      // ellipseMode(CENTER);
      // ellipse(0, 0, 300);
      textSize(96);
      textAlign(CENTER);
      fill(255);
      stroke(255);
      strokeWeight(1);
      //textFont(font);
      text(value[spectrumInt], 0, 30);

      mag = map(value[i], -0.44, 0.94, circleId/2, circleOd/2);

      spectrumIntPrev = i - 1;
      magPrev = map(value[spectrumIntPrev], -0.44, 0.94, circleId/2, circleOd/2);

        push();
    if (mag >= 175){
        fill(255, 0, 0, 100);
      }else{
        fill(0, 0, 255, 100);
      }
    v1 = createVector(0, -mag);
    v1.rotate(i * 0.5235988);

      // if (magPrev >= 200){
      //     stroke(255, 0, 0);
      //   }else{
      //     stroke(0, 0, 255);
      //   }

    //if (spectrumIntPrev >= 0){
      v2 = createVector(0, -magPrev);
      v2.rotate(spectrumIntPrev * 0.5235988);

      noStroke();
      beginShape();
      vertex(0,0);
      vertex(v1.x,v1.y);
      vertex(v2.x,v2.y);
      endShape(CLOSE);
      pop();
    }
  }
}
