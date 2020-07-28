class QuadTree {
  constructor(boundary, depth = 0, capacity = 4){
    this.boundary = boundary;
    this.capacity = capacity;
    this.boids = [];
    this.divided = false;
    this.max_depth = 32;
    this.depth = depth;
    this.max_sample_size = 4;
  }

  insert(boid) {

    if (!this.boundary.contains(boid)) {
      return false;
    }

    if (this.depth === this.max_depth || this.boids.length < this.capacity) {
      this.boids.push(boid);
      return true;
    } else {
      if(!this.divided && this.depth < this.max_depth) {
        this.subdivide();
      }

      if (this.northeast.insert(boid)) return true;
      if (this.northwest.insert(boid)) return true;
      if (this.southeast.insert(boid)) return true;
      if (this.southwest.insert(boid)) return true;
    }
  }

  getBoids() {
    if (this.divided) {
      let sub_boids = [];
      sub_boids = sub_boids.concat(this.northeast.getBoids());
      sub_boids = sub_boids.concat(this.northwest.getBoids());
      sub_boids = sub_boids.concat(this.southeast.getBoids());
      sub_boids = sub_boids.concat(this.southwest.getBoids());
      return sub_boids;
    } else {
      // If there are a lot of boids at the max depth then just get the first 10
      return this.boids.slice(this.max_sample_size);
    }
  }

  query(range) {
    let found = [];
    // if boundary doesn't intersect range at all, just return
    if (!this.boundary.intersects(range)) {
      return found;
    } else if (this.boundary.enclosed(range)) { // If the boundary is completely in the range then ...
      if(!this.divided) found = found.concat(this.boids); // return all the boids if undivided otherwise ...
      else { // if divided then return all boids in sub quadTrees
        found = found.concat(this.getBoids());
      }
    } else {
      if (this.divided) {
        found = found.concat(this.northeast.query(range));
        found = found.concat(this.northwest.query(range));
        found = found.concat(this.southeast.query(range));
        found = found.concat(this.southwest.query(range));
      } else {
        for(let i = 0; i < this.boids.length; i++) {
          if (range.contains(this.boids[i])) {
            found = found.concat(this.boids[i]);
          }
        }
      }
     }
     return found;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w;
    const h = this.boundary.h;

    const nw = new Rectangle(x - w/2, y - h / 2, w/2, h/2);
    this.northwest = new QuadTree(nw, this.depth+1, this.capacity);
    const ne = new Rectangle(x + w/2, y - h / 2, w/2, h/2);
    this.northeast = new QuadTree(ne, this.depth+1, this.capacity);
    const sw = new Rectangle(x - w/2, y + h / 2, w/2, h/2);
    this.southwest = new QuadTree(sw, this.depth+1, this.capacity);
    const se = new Rectangle(x + w/2, y + h / 2, w/2, h/2);
    this.southeast = new QuadTree(se, this.depth+1, this.capacity);

    // move current boids into sub quad trees
    for(let i = 0; i < this.boids.length; i++) {
      let inserted = false;
      inserted = this.northeast.insert(this.boids[i]);
      if(!inserted) inserted = this.northwest.insert(this.boids[i]);
      if(!inserted) inserted = this.southeast.insert(this.boids[i]);
      if(!inserted) inserted = this.southwest.insert(this.boids[i]);
    }
    this.divided = true;
  }
}

class Rectangle{
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(boid) {
    const boid_x = boid.position.x;
    const boid_y = boid.position.y;
    return (
      boid_x >= this.x - this.w &&
      boid_x < this.x + this.w &&
      boid_y >= this.y - this.h &&
      boid_y < this.y + this.h
    );
  }

  // Does the rectangle intersects the range rectangle
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }

  // Is the rectangle completed enclosed in the range rectangle
  enclosed(range) {
    return (range.x - range.w < this.x - this.w &&
      range.x + range.w > this.x + this.w &&
      range.y - range.h < this.y - this.h &&
      range.y + range.h > this.y + this.h);
  }
}