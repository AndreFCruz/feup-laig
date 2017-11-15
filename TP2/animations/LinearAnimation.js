class LinearAnimation extends Animation {
  
  constructor(id, speed, controlPoints) {
    super(id);
    this.speed = speed;

    this.controlPoints = controlPoints;

    this.lineSegments = [];
    this.length = 0;
    this.segmentIdx = 0;
    this.divisions = [0];	//Percentages were new segments start

  	for (let i = 1; i < this.controlPoints.length; ++i) {
			let segX = this.controlPoints[i][0] - this.controlPoints[i-1][0];
			let segY = this.controlPoints[i][1] - this.controlPoints[i-1][1];
			let segZ = this.controlPoints[i][2] - this.controlPoints[i-1][2];
			this.lineSegments.push([segX, segY, segZ]);

			this.length += Math.sqrt(Math.pow(segX, 2) + Math.pow(segY, 2) + Math.pow(segZ, 2));
			this.divisions.push(this.length);
		}

		this.duration = this.length / this.speed;

		for (let i = 0; i < this.divisions.length; ++i)
			this.divisions[i] /= this.length;		
  }

  update(elapsedTime) {
  	if (elapsedTime > this.duration)
  		return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);
    mat4.translate(this.matrix, pos);
  }

  calcPosition(t) {
    if (t <= 0 || t >= 1)
        throw new Error("Invalid t parameter to Linear Animation");

		if (t > this.divisions[this.segmentIdx + 1]) {
			this.segmentIdx++;
			this.setOrientation(this.lineSegments[this.segmentIdx]);
		}

		let currSegmentPercentage = (t - this.divisions[this.segmentIdx]);
		let currentSeg = this.lineSegments[this.segmentIdx];

		return [
			this.controlPoint[this.segmentIdx] + currentSeg[0] * currSegmentPercentage,
			this.controlPoint[this.segmentIdx] + currentSeg[1] * currSegmentPercentage,
			this.controlPoint[this.segmentIdx] + currentSeg[2] * currSegmentPercentage,
		];
  }

}
