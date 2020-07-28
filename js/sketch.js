const flock = [];
const num_boids = 1500;
let width;
let height;
let qt;
let canvas_boundary;
let red_leader;
let blue_leader;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  frameRate(30);
  canvas_boundary = new Rectangle(width/2, height/2 , width/2, height/2);
  qt = new QuadTree(canvas_boundary);

  for (let i = 0; i < num_boids; i++) { 
    const special = i === 0 || i === 1;
    const boid = new Boid(i % 2, special);
    flock.push(boid);
    qt.insert(boid);
  }
  red_leader = flock[0];
  blue_leader = flock[1];
}

function draw() {
  background(44, 62, 80);
  const new_qt = new QuadTree(canvas_boundary);
  let teamZero = 0;
  let teamOne = 0;
  for(let i = 0; i < flock.length; i++) {
    if(flock[i].deleted)  {
      flock.splice(i, 1);
      continue;
    }
    if(flock[i].team) teamOne++;
    else teamZero++;
    flock[i].edges();
    flock[i].flock(qt, flock);
    flock[i].update();
    const boid = flock[i].show();
    new_qt.insert(boid);
  }
  textSize(12);
  fill(255);
  text(`Red: ${teamZero}`, 10, 30);
  text(`Blue: ${teamOne}`, 65, 30);
  text(`${frameRate().toFixed(0)}`, width - 30, 30);
  qt = new_qt;
}

