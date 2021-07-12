class Camera {
	constructor(x, y, w, h){
		this.pos = createVector(x, y);
		this.w = w;
		this.h = h;
	}

	update(){
		this.pos.x = player.pos.x + player.vel.x - this.w/2;
		this.pos.y = player.pos.y + player.vel.y - this.h/2;

		if(this.pos.x < 0){
			this.pos.x = 0;
		}
		if(this.pos.y < 0){
			this.pos.y = 0;
		}
		if(this.pos.x + this.w > COL*TILE){
			this.pos.x = COL*TILE - this.w;
		}
		if(this.pos.y + this.h > ROW*TILE){
			this.pos.y = ROW*TILE - this.h;
		}
	}
}