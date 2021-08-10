/* 
  KEYPOINTS: 
  0: {score: 0.9972330927848816, part: "nose", position: {…}}
  1: {score: 0.9991559982299805, part: "leftEye", position: {…}}
  2: {score: 0.9994059801101685, part: "rightEye", position: {…}}
  3: {score: 0.9430738091468811, part: "leftEar", position: {…}}
  4: {score: 0.907176673412323, part: "rightEar", position: {…}}
  5: {score: 0.9091808199882507, part: "leftShoulder", position: {…}}
  6: {score: 0.8460482358932495, part: "rightShoulder", position: {…}}
  7: {score: 0.12052525579929352, part: "leftElbow", position: {…}}
  8: {score: 0.03441983461380005, part: "rightElbow", position: {…}}
  9: {score: 0.011429603211581707, part: "leftWrist", position: {…}}
  10: {score: 0.009657999500632286, part: "rightWrist", position: {…}}
  11: {score: 0.004093104507774115, part: "leftHip", position: {…}}
  12: {score: 0.015475892461836338, part: "rightHip", position: {…}}
  13: {score: 0.0022511701099574566, part: "leftKnee", position: {…}}
  14: {score: 0.028987331315875053, part: "rightKnee", position: {…}}
  15: {score: 0.002615690464153886, part: "leftAnkle", position: {…}}
  16: {score: 0.01452912762761116, part: "rightAnkle", position: {…}}
 */

export const calculateAngle = (p1, p2, p3) => {
  console.log("received", p1, p2, p3);

  const { x: x1, y: y1 } = p1.position;
  const { x: x2, y: y2 } = p2.position;
  const { x: x3, y: y3 } = p3.position;

  console.log(x1, x2, x3, y1, y2, x3);

  const angle =
    (Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)) / (Math.PI / 180);

  return angle;
};
