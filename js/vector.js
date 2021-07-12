let degrees = function(radians){
	return 180*radians/Math.PI;
}

let radians = function(degrees){
	return Math.PI*degrees/180;
}

let createVector = function(x, y){
	let v = new Vector(Math.random(), Math.random());
	
	if(x && y){
		v.x = x;
		v.y = y;
	}

	return v;
}

class Vector {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	static add(v, u){
		return new Vector(v.x + u.x, v.y + u.y);
	}

	add(v){
		this.x += v.x;
		this.y += v.y;
	}

	static subtract(v, u){
		return new Vector(v.x - u.x, v.y - u.y);
	}

	subtract(v){
		this.x -= v.x;
		this.y -= v.y;
	}

	mult(s){
		this.x *= s;
		this.y *= s;
	}

	div(s){
		this.x /= s;
		this.y /= s;
	}

	dot(v){
		return this.x*v.x + this.y*v.y;
	}

	norm(){
		let m = this.mag();

		if(m){
			this.x /= m;
			this.y /= m;
		}
	}

	mag(){
		let xs = this.x*this.x;
		let ys = this.y*this.y;

		return Math.sqrt(xs + ys);
	}

	magsq(){
		let xs = this.x*this.x;
		let ys = this.y*this.y;

		return xs + ys;
	}

	setMag(s){
		this.norm();
		this.mult(s);
	}

	limit(s){
		if(this.mag() > s){
			this.setMag(s);
		}
	}

	dist(v){
		let xs = (this.x - v.x)*(this.x - v.x);
		let ys = (this.y - v.y)*(this.y - v.y);

		return Math.sqrt(xs + ys);
	}

	distsq(v){
		let xs = (this.x - v.x)*(this.x - v.x);
		let ys = (this.y - v.y)*(this.y - v.y);

		return xs + ys;
	}

	heading(){
		return degrees(Math.atan(this.y/this.x));
	}

	angleBetween(v){
		let d = this.dot(v);
		let m = this.mag()*v.mag();

		return degrees(Math.acos(d/m));
	}

	rotate(degrees){
		this.x = Math.cos(radians(degrees))*this.x - Math.sin(radians(degrees))*this.y;
		this.y = Math.sin(radians(degrees))*this.x + Math.cos(radians(degrees))*this.y;
	}

	proj(v){
		let d = this.dot(v);
		let m = v.mag();

		return d/m;
	}

	static proj(v, u){
		let a = u.copy();
		let p = v.proj(a)*(1/a.mag());
		a.mult(p);

		return a;
	}

	copy(){
		return new Vector(this.x, this.y);
	}
}