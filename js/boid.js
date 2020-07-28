class Boid {
  constructor(team, special = false, x = random(width), y = random(height), ) {
   this.position = createVector(x, y);
    // this.position = createVector(width/2, height/2);
    this.velocity = p5.Vector.random2D();
    // this.velocity = createVector(init_x_velocity, init_y_velocity);
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.max_force = 0.05;
    this.max_speed = 2.8;

    this.align_proximity = 35;
    this.cohesion_proximity = 25;
    this.separation_proximity = 52;
    this.special_proximity = 15;
    this.largest_proximity = this.align_proximity;
    if (this.cohesion_proximity > this.largest_proximity) this.largest_proximity = this.cohesion_proximity;
    if (this.separation_proximity > this.largest_proximity) this.largest_proximity = this.separation_proximity;

    this.boid_fov = PI / 6; // 300 degrees
    this.special = special;
    this.team = team;
    if(this.team === 0) {
      this.color = this.special ? color('red') : color(246, 193, 1);
    } else {
      this.color = this.special ? color(1, 193, 246) : color(0,139,139);
    }

  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  flock(qt, flock) {

    const approximate_range = new Rectangle(this.position.x, this.position.y, this.largest_proximity/2, this.largest_proximity/2);
    const boids_in_quadrant = qt.query(approximate_range);

    let align_steering = createVector();
    let cohesion_steering = createVector();
    let separation_steering = createVector();

    let align_total = 0;
    let cohesion_total = 0;
    let separation_total = 0;

    for (let i = 0; i < boids_in_quadrant.length; i++) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance === 0) continue;

        // Alignment
        if (distance < this.align_proximity) {
          align_steering.add(boids_in_quadrant[i].velocity);
          align_total++;
        }

        // Cohesion
        if (distance < this.cohesion_proximity) {

          cohesion_steering.add(boids_in_quadrant[i].position);
          cohesion_total++;
        }
        //Separation
        if (distance < this.separation_proximity) {

          const difference = p5.Vector.sub(this.position, boids_in_quadrant[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          separation_steering.add(difference);
          separation_total++;
        }
        if (this.special && this.inView(boids_in_quadrant[i]) && distance < this.special_proximity ) {
          
          const eat_chance = floor(random(2));
          const breed_chance = floor(random(2));
          if(this.team !== boids_in_quadrant[i].team && eat_chance === 0) {
            console.log('Boid eaten')
            boids_in_quadrant[i].deleted = true;
          }
          if(this.team === boids_in_quadrant[i].team && breed_chance === 0) {
            console.log('Boid created');
            flock.push(new Boid(this.team, false, this.position.x, this.position.y));
          } 
        }
    }
    const alignVector = this.getAlignVector(align_steering, align_total);
    const cohesionVector = this.getCohesionVector(cohesion_steering, cohesion_total);
    const separationVector = this.getSeparationVector(separation_steering, separation_total);
    const avoidVector = 
    this.acceleration.add(alignVector);
    this.acceleration.add(cohesionVector);
    this.acceleration.add(separationVector);
  }

  getAlignVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  getCohesionVector(steering, total)  {
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  getSeparationVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  inView(target) {
    const sub = p5.Vector.sub(target.position, this.position);
    const angleBetween = abs(this.velocity.angleBetween(sub));
    const inView = angleBetween < (this.boid_fov / 2);
    // if(this.special) debugger;
    return inView;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
    return this;
  }

  show() {
    strokeWeight(1);
    stroke(this.color);
    noFill(); // It is more performant without filling

		const r = 3;
		const angle = this.velocity.heading();
		const anglePlus = 2.5;
    triangle(
			this.position.x + Math.cos(angle) * r, this.position.y + Math.sin(angle) * r,
			this.position.x + Math.cos(angle + anglePlus) * r, this.position.y + Math.sin(angle + anglePlus) * r,
			this.position.x + Math.cos(angle - anglePlus) * r, this.position.y + Math.sin(angle - anglePlus) * r
    );

    if(this.special) {
      const arc_start = this.velocity.heading() - (this.boid_fov / 2);
      const arc_end = this.velocity.heading() + (this.boid_fov / 2);
      const diameter = this.special_proximity;
      stroke('rgba(255,255,255, 0.25)');
      fill('rgba(255,255,255, 0.25)');
      arc(this.position.x, this.position.y, diameter, diameter, arc_start, arc_end); 

      // noFill();
      // rectMode(RADIUS);
      // rect(this.position.x, this.position.y, this.largest_proximity/2, this.largest_proximity/2);
    }
    return this;
  }
}