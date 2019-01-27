//Made by Waseem Girach
//waseem-g.com/portfolio
//https://www.linkedin.com/in/waseemgirach/

//NOAA National Centers for Environmental information, Climate at a Glance: Global Time Series,
//published May 2018, data retrieved on May 27, 2018 from http://www.ncdc.noaa.gov/cag/

//This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License

var tempAn;
var spectrumIntPrev;
var spectrumInt = 0; //for autoplay no interaction
var textString1,textString2,textString3,textString4;
var label, value;
var mag, magPrev;
var v1,v2;
var smallScale = 0.25;
var circleOd = 525 * smallScale; //originally 450
var circleId = 175 * smallScale; //originally 300
var circleMd = ((circleOd-circleId)* 0.3188)+circleId; // float multiplier dictated by value of zero point in data set. 
var frameRt = 5;
var j;
var fillLength;
var luls;
var backgroundCol = 0;
var percentBlue,percentRed, c;
var clockVec1,clockVec2, resVec;

function setGradient(x, w, c1, c2) {
  noFill();
    for (let k = x; k <= w; k++) {
        let inter = map(k, 0, w, 0, 1);
        let c = lerpColor(c1, c2, inter);
        return c;
      }
}

function setup(){
    createCanvas(192,157); //originally was (1250,530)
    frameRate(frameRt);
}

function draw(){
  background(backgroundCol);
  translate(width/2, (height/2) - 4);

  fill(backgroundCol);
  stroke(140);
  ellipse(0, 0, circleMd);
  
  // line(circleMd/2,0,(circleMd/2)-5,0);
  // line(0,circleMd/2,0,(circleMd/2)-5);
  // line(-circleMd/2,0,-1*((circleMd/2)-5),0);
  // line(0,-circleMd/2,0,-1*((circleMd/2)-5));
  
  // clockVec1 = createVector(circleMd/2-3,0);
  // clockVec2 = createVector(circleMd/2,0);
  
  // resVec = clockVec2.sub(clockVec1);
  
  //additional information
  push();
  textAlign(CENTER);
  fill(200);
  textSize(4);
  strokeWeight(0.1);
  textString1 = "Visualización de anomalías de temperatura desde 1880 hasta 2016.";
  textString2 = "Los valores de anomalía de temperatura utilizados son con respecto al promedio del siglo XX.";
  //text(textString1,-80,77);
  text(textString2,0,79);
  pop();

  label = Object.keys(tempAn); //Label is an array
  value = Object.values(tempAn); //Value is an array

  if (frameCount % frameRt == 0){
    spectrumInt+=1;
    if(spectrumInt >= label.length){
      spectrumInt = 0;
    }
  }

  for (var i = 0; i <= spectrumInt; i++){
    
    textSize(11);
    textAlign(CENTER);
    fill(255);
    stroke(200);
    strokeWeight(0.5);
    text(value[spectrumInt] + "°", 0, 4);
   
    mag = map(value[i], -0.44, 0.94, circleId/2, circleOd/2);

    spectrumIntPrev = i - 1;
    magPrev = map(value[spectrumIntPrev], -0.44, 0.94, circleId/2, circleOd/2);

    push();
    if (value[spectrumIntPrev] >= 0){
        fill(255, 0, 0, 100);
      }else{
        fill(0, 0, 255, 100);
    }
    v1 = createVector(0, -mag);
    v1.rotate(i * 0.5235988);
    v2 = createVector(0, -magPrev);
    v2.rotate(spectrumIntPrev * 0.5235988);
    noStroke();
    beginShape();
    vertex(0,0);
    vertex(v1.x,v1.y);
    vertex(v2.x,v2.y);
    endShape(CLOSE);
    pop();
    
    luls = parseInt(label[spectrumInt]);
    fillLength = map(luls, 1880, 2016, 0, 160);
  }
  
  stroke(75);
  rectMode(CENTER);
  fill(backgroundCol);
  rect(0, 70, 160, 6);
  line(-80,67,-80,65);
  line(80,67,80,65);
  
  for (j = -60; j <= 60; j+=20){
    line(j,72,j,65);
  }
  
  push();
  fill(210);
  textSize(5);
  strokeWeight(0.1);
  text("1880",-80,64);
  text("1920",-40,64);
  text("1960",0,64);
  text("2000",40,64);
  text("2016",80,64);
  pop();
  
  for(var t =0; t<=fillLength; t++){
    percentBlue = color(0,0,255);
    percentRed = color(255,0,0);
    c = setGradient(t,160,percentBlue,percentRed);
    stroke(c);
    line(-79.5+t, 67.5, -79.5+t, 67.5 + 5);
  }
}
