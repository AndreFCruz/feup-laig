class ComboAnimation extends Animation {
  constructor(animations) {
    super();
    this.animations = animations;
    this.cumulative = 0;
    this.animIdx = 0;

    this.calcComboDuration();
  }

  checkAnimationsIntegrity(animations) {
    for (let i = 0; i < animations.length; i++) {
      if (animations[i] instanceof ComboAnimation)
        throw new Error("Error: Nested combo animations.");
    }
  }

  calcComboDuration() {
    this.duration = 0;
    for (let i = 0; i < this.animations.length; i++) {
      this.duration += this.animations[i].duration;
    }
  }

  increaseAnimIdx() {
    if (this.animIdx + 1 < this.animations.length) {
      this.animations[this.animIdx].reset();
      this.animIdx++;
    } else {
      this.reset();
    }
  }

  reset() {
    this.cumulative = 0;
    this.animIdx = 0;
    console.log("End of combo animation.");
  }

  update(elapsedTime) {
    if (elapsedTime > this.duration) {
      this.reset();
      return null;
    }

    let anim = this.animations[this.animIdx];
    if (elapsedTime - this.cumulative > anim.duration) {
      this.cumulative += anim.duration;
      this.increaseAnimIdx();
      anim = this.animations[this.animIdx];
    }

    let localElapsedTime = elapsedTime - this.cumulative;
    anim.update(localElapsedTime);
    this.matrix = anim.matrix;
  }
}
