const flock = [];
const num_boids = 420;
const width = 1500;
const height = 850;
let qt;
let canvas_boundary;
function setup() {
  createCanvas(width, height);
  // frameRate(1);
  canvas_boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qt = new QuadTree(canvas_boundary);

  for (let i = 0; i < num_boids; i++) { 
    //flock.push(new Boid());
    const boid = new Boid();
    flock.push(boid);
    qt.insert(boid);
  }
}

function draw() {
  background(44, 62, 80);
  const new_qt = new QuadTree(canvas_boundary);
  for(let i = 0; i < flock.length; i++) {
    flock[i].edges();
    flock[i].flock(qt);
    flock[i].update();
    let special = i % num_boids === 0 ? true : false;
    const point = flock[i].show(special);
    new_qt.insert(point);
  }
  qt = new_qt;
}

