const flock = [];

function setup() {
  createCanvas(640, 360);
  flock.push(new Boid());
}

function draw() {
  background(51);

  for(let i = 0; i < flock.length; i++) {
    flock[i].update();
    flock[i].show();
  }
}

