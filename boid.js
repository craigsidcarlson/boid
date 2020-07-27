class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.new_acceleration = createVector();
    this.max_force = 0.1;
    this.max_speed = 3.8;
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }


  align(qt) {
    let proximity = 30;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range)
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
          steering.add(boids_in_quadrant[i].velocity);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  
  cohesion(qt) {
    let proximity = 45;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range);
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        if(!boids_in_quadrant[i]) debugger;
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
          steering.add(boids_in_quadrant[i].position);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  separation(qt) {
    let proximity = 35;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range)
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
         const difference = p5.Vector.sub(this.position, boids_in_quadrant[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          steering.add(difference);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }
  flock(boids) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
    return this;
  }

  show(special = false) {
    strokeWeight(1);
    if (special) stroke(201, 105, 18);
    else stroke(246, 193, 1);
    noFill(); // It is more performant without filling
		const r = 3;
		const angle = this.velocity.heading();
		const anglePlus = 2.5;
    triangle(
			this.position.x + Math.cos(angle) * r, this.position.y + Math.sin(angle) * r,
			this.position.x + Math.cos(angle + anglePlus) * r, this.position.y + Math.sin(angle + anglePlus) * r,
			this.position.x + Math.cos(angle - anglePlus) * r, this.position.y + Math.sin(angle - anglePlus) * r
		);
    return this;
  }
}