class ComboAnimation extends Animation {
  constructor(id, animations) {
    super(id);
    this.animations = animations;
    this.cumulative = 0;
    this.animIdx = 0;

    this.calcComboDuration();
  }

  calcComboDuration() {
    this.duration = 0;
    for (let i = 0; i < this.animations.length; i++) {
      this.duration += this.animations[i].duration;
    }
  }

  increaseAnimIdx() {
    if (this.animIdx + 1 < this.animations.length) {
      this.animIdx++;
    }
  }

  update(elapsedTime) {
    if (elapsedTime > this.duration)
      return null;

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
