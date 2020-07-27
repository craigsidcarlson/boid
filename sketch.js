const flock = [];
const num_boids = 20;
const width = 1080;
const height = 720;
let qt;
let canvas_boundary;
function setup() {
  createCanvas(width, height);

  canvas_boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qt = new QuadTree(canvas_boundary);

  console.log(qt);
  for (let i = 0; i < num_boids; i++) { 
    //flock.push(new Boid());
    const boid = new Boid();
    flock.push(boid);
    qt.insert(boid);
  }
}

function draw() {
  background(51);
  const new_qt = new QuadTree(canvas_boundary);
  for(let i = 0; i < flock.length; i++) {
    flock[i].edges();
    flock[i].flock(qt, new_qt);
    flock[i].update();
    flock[i].show();
  }
  qt = new_qt;
}

