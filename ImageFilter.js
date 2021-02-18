var canvas = null;
var context = null;
var finput = null;

var originimg = null;
var grayimg = null;
var redimg = null;
var blurimg = null;

var color = 'black';
var radius = 50;
var isPainting = false;


function upload() {
  finput = document.getElementById("finput");
  canvas = document.getElementById("can1");
  context = canvas.getContext("2d");
  originimg = new SimpleImage(finput);
  grayimg = new SimpleImage(finput);
  redimg = new SimpleImage(finput);
  blurimg = new SimpleImage(finput);
  originimg.drawTo(canvas);
  setInterval("getname()",1000);
}

function imageIsLoaded(image) {
  if(image == null || !image.complete()) {
    return false;
  }
  return true;
}


// *******************************
// function for Grayscale filter

function doGray() {
  if ( imageIsLoaded(originimg) ) {
    filterGray();
    grayimg.drawTo(canvas);
  }
  else {
    alert("Image not loaded");
    return
  }
}

function filterGray() {
    for (var px of grayimg.values()) {
      var avg = (px.getRed() + px.getGreen() + px.getBlue())/3
      px.setRed(avg);
      px.setGreen(avg);
      px.setBlue(avg);
    }
}

// *******************************
// function for red filter

function doRed() {
  if ( imageIsLoaded(originimg) ) {
    filterRed();
    redimg.drawTo(canvas);
  }
  else {
    alert("Image not loaded");
    return
  }
}

function filterRed() {
  for (var px of redimg.values()) {
    var avg = (px.getRed() + px.getGreen() + px.getBlue())/3;
    if (avg < 128) {
      px.setRed(2 * avg);
      px.setGreen(0);
      px.setBlue(0);
    }
    else {
      px.setRed(255);
      px.setGreen(2 * avg - 255);
      px.setBlue(2 * avg - 255);
    }
  }
}

// *******************************
// function for blur filter

function doBlur() {
  if ( imageIsLoaded(originimg) ) {
    filterBlur();
    blurimg.drawTo(canvas);
  }
  else {
    alert("Image not loaded");
    return
  }
}

function filterBlur() {
  for (var px of blurimg.values()) {
    var rand = Math.random();
    if (rand > 0.5) {
      var x = px.getX();
      var y = px.getY();
      var nearPixel = findNearbyPx(x, y);
      px.setRed(nearPixel.getRed());
      px.setGreen(nearPixel.getGreen());
      px.setBlue(nearPixel.getBlue());
    } 
  }
}

function findNearbyPx(x, y){
  var maxWidth = blurimg.getWidth();
  var maxHeight = blurimg.getHeight();
  if (Math.random() < 0.5) {
    var direction = 1;
  }
  else {
    var direction = -1;
  }
  var randDistX = Math.floor(Math.random() * 11);
  var randDistY = Math.floor(Math.random() * 11);
  var nearX = x + randDistX * direction;
  var nearY = y + randDistY * direction;
  if (nearX > maxWidth - 1) {
    nearX = maxWidth -1;
  }
  if (nearX < 0) {
    nearX = 0
  }
  if (nearY > maxHeight - 1) {
    nearY = maxHeight -1;
  }
  if (nearY < 0) {
    nearY = 0;
  }
  return blurimg.getPixel(nearX, nearY);
}


// ***************************************
// clean the image

function cleanImage() {
  if (canvas == null) {
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  originimg = null;
  grayimg = null;
  redimg = null;
  blurimg = null;
  finput = null;
}

function resetImage() {
  if (originimg!= null) {
    originimg.drawTo(canvas);
    grayimg = new SimpleImage(finput);
    redimg = new SimpleImage(finput);
    blurimg = new SimpleImage(finput);
  }
  else {
    alert("Image not loaded");
    return
  }
}

function getname() {
  var filename = $("#btn .file").val();
  $("#filename").text(filename);
}


// ****************************** 
// function for painter

function paintCircle (x, y) {
    // make sure to start a new circle each time
    context.beginPath();
    // draw circle using a complete (2*PI) arc around given point
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
}

function startPaint() {
  isPainting = true;
}

function endPaint() {
  isPainting = false;
}

function doPaint(x, y) {
  if(isPainting) {
    var bbox = canvas.getBoundingClientRect();
    paintCircle (x * (canvas.width / bbox.width), y * (canvas.height / bbox.height));
  }
}

function changeColor(newColor) {
  color = newColor;
}

function resizeBrush(newSize) {
  radius = newSize;   
  document.getElementById("sizeOutput").value = newSize;
}




