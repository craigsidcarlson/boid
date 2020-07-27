class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.new_acceleration = createVector();
    this.max_force = 0.1;
    // this.max_speed = 1.8;
    this.max_speed = 0;
    this.sz = 10;
    this.n = Math.round(random(3, 8));
    this.h = random(360);
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  // act(boids) {
  //   let alignment_proximity = 35;
  //   let cohesion_proximity = 28;
  //   let separation_proximity = 20;
  //   let align_total = 0;
  //   let cohesion_total = 0;
  //   let separation_total = 0;
  //   let align = createVector();
  //   let cohesion = createVector();
  //   let separation = createVector();
  //   for(let i = 0; i < boids.length; i++) {
  //     if (boids[i] !== this) {
  //       const distance = dist(
  //         this.position.x, 
  //         this.position.y, 
  //         boids[i].position.x,
  //         boids[i].position.y
  //       );
  //       if (distance < alignment_proximity) {
  //         align.add(boids[i].velocity);
  //         align_total++;
  //       }
  //       if (distance < cohesion_proximity) {
  //         cohesion.add(boids[i].position);
  //         cohesion_total++;
  //       }
  //       if (distance < separation_proximity) {
  //         const difference = p5.Vector.sub(this.position, boids[i].position);
  //         const dif_mag = difference.mag();
  //         if (dif_mag === 0) continue;
  //         difference.div(dif_mag * dif_mag);
  //         separation.add(difference);
  //         separation_total++;
  //       }
  //     }
  //   }
  //   if (align_total > 0) {
  //     align.div(align_total);
  //     align.setMag(this.max_speed);
  //     align.sub(this.velocity);
  //     align.limit(this.max_force);
  //   }
  //   if (cohesion_total > 0) {
  //     cohesion.div(cohesion_total);
  //     cohesion.sub(this.position);
  //     cohesion.setMag(this.max_speed);
  //     cohesion.sub(this.velocity);
  //     cohesion.limit(this.max_force);
  //   }
  //   if (separation_total > 0) {
  //     separation.div(separation_total);
  //     separation.setMag(this.max_speed);
  //     separation.sub(this.velocity);
  //     separation.limit(this.max_force*1.5);
  //   }
  //   let steer = createVector().add(align).add(cohesion).add(separation);
  //   if(steer.mag() < 1.5) {
  //     steer.setMag(steer.mag() * random(2, 3));
  //   }
  //   return steer;
  // }

  flock(boids) {
    this.acceleration.set(0,0);
    let steer = this.act(boids);
    this.acceleration.add(steer);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
  }

  show() {
    let theta = this.velocity.heading() + PI / 2;
    strokeWeight(3);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}