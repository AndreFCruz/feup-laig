class LinearAnimation extends Animation {
  
  constructor(id, speed, controlPoints) {
    super(id);
    this.speed = speed;

    this.controlPoints = controlPoints;

    this.lineSegments = [];
    this.length = 0;
    this.currentSegment = 0;

  	for (let i = 1; i < this.controlPoints.length; ++i) {
			let segX = this.controlPoints[i][0] - this.controlPoints[i-1][0];
			let segY = this.controlPoints[i][1] - this.controlPoints[i-1][1];
			let segZ = this.controlPoints[i][2] - this.controlPoints[i-1][2];
			this.lineSegments.push([segX, segY, segZ]);

			this.length += Math.sqrt(Math.pow(segX, 2) + Math.pow(segY, 2) + Math.pow(segZ, 2));
		}

		this.duration = this.length / this.speed;

		this.lineDivisions = [0];
		for (let i = 0; i < this.lineSegments.length; ++i) {
			this.lineDivisions.push(Math.sqrt(
				Math.pow(this.lineSegments[i][0], 2) + 
				Math.pow(this.lineSegments[i][1], 2) + 
				Math.pow(this.lineSegments[i][2], 2)
				)/this.length);
		}
  }

  update(elapsedTime) {
  	if (elapsedTime > this.duration)
  		return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);
    mat4.translate(this.matrix, pos);
  }

  /*updatePosition(xInc, yInc, zInc) {
  	this.position[0] += xInc;
  	this.position[1] += yInc;
  	this.position[2] += zInc;

  	this.runDist += Math.sqrt(Math.pow(xInc, 2) + Math.pow(yInc, 2) + Math.pow(zInc, 2));
  }*/

  /*checkEndOfSeg() {
  	if (this.runDist >= this.lineSegDistances[this.curLineSegIdx]) {
  		this.runDist = 0;
  		
	  	if (this.curLineSegIdx++ < this.numCPs) {
	  		this.stop();
	  	}
  	}
  }*/

  calcPosition(t) {
    if (t <= 0 || t >= 1)
        throw new Error("Invalid t parameter to Linear Animation");

		if (t > this.lineDivisions[this.currentSegment + 1]) {
			this.currentSegment++;
			this.setOrientation(this.lineSegments[this.currentSegment]);
		}


		let currSegmentPercentage = (t - this.lineDivisions[this.currentSegment]);
		let currentSeg = this.lineSegments[this.currentSegment];

		return [
			this.controlPoint[this.currentSegment] + currentSeg[0] * currentSegment,
			this.controlPoint[this.currentSegment] + currentSeg[1] * currentSegment,
			this.controlPoint[this.currentSegment] + currentSeg[2] * currentSegment,
		];
  }

}
