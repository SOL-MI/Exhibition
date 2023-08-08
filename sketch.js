let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  video = createCapture(VIDEO);// Create the video
  video.id("video");
  video.size(width, height);
  //video.hide(); //비디오 숨기기

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Initialize the model: モデルの初期化
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces
}

// Got faces: 顔を検知
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections
  // console.log(detections);

  clear();//Draw transparent background;
  drawBoxs(detections);//Draw detection box
  drawLandmarks(detections);//// Draw all the face points
  drawExpressions(detections, 20, 250, 14);//Draw face expression

  faceapi.detect(gotFaces);// Call the function again at here
}

function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
      // ellipse(_x,_y, 40, 40);
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected
    let {neutral, happy, angry, sad, surprised} = detections[0].expressions;
    textSize(14);
    noStroke();
    fill(44, 169, 225);
    
    text("neutral:       " + nf(neutral*100, 0,0)+"%", x+textYSpace*5, textYSpace*5);
    text("happiness:   " + nf(happy*100, 0,0)+"%", x+textYSpace*5, textYSpace*6);
    text("anger:         " + nf(angry*100, 0,0)+"%", x+textYSpace*5, textYSpace*7);
    text("sad:            "+ nf(sad*100,  0,0)+"%", x+textYSpace*5, textYSpace*8);
    text("surprised:     " + nf(surprised*100, 0,0)+"%", x+textYSpace*5, textYSpace*9);
  }else{//If no faces is detected: 顔が1つも検知されていなかったら
    text("neutral: ",  x+textYSpace*5, textYSpace*5);
    text("happiness: ",x+textYSpace*5, textYSpace*6);
    text("anger: ", x+textYSpace*5, textYSpace*7);
    text("sad: ", x+textYSpace*5, textYSpace*8);
    text("surprised: ",  x+textYSpace*5, textYSpace*9);
  }
}
// function draw(){
  // clear();//Draw transparent background
  // image(video, 0, 0, width, height);
// }