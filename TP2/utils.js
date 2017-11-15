function pointDiff(p1, p2, scale = 1) {
  return [
    scale * (p1[0] - p2[0]),
    scale * (p1[1] - p2[1]),
    scale * (p1[2] - p2[2])
  ];
}
