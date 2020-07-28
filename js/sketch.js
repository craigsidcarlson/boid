let width;
let height;
let env;
let canvas_boundary;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  frameRate(30);
  canvas_boundary = new Rectangle(width/2, height/2 , width/2, height/2);
  const qt = new QuadTree(canvas_boundary);
  env = new Environment(qt);

  for (let i = 0; i < env.starting_count; i++) { 
    const boid = env.add_boid();
    env.qt.insert(boid);
  }
}

function draw() {
  background(44, 62, 80);
  const new_qt = new QuadTree(canvas_boundary);
  for(let i = 0; i < env.flock.length; i++) {
    if(env.flock[i].deleted)  {
      env.flock.splice(i, 1);
      continue;
    }

    env.flock[i].edges();
    env.flock[i].flock();
    env.flock[i].update();
    const boid = env.flock[i].show();
    new_qt.insert(boid);
  }
  textSize(12);
  fill(255);
  text(`Red: ${env.red_team_count}`, 10, 30);
  text(`Blue: ${env.blue_team_count}`, 65, 30);
  text(`${frameRate().toFixed(0)}`, width - 30, 30);
  env.qt = new_qt;
}

