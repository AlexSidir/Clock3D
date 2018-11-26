const clockDefaults = {
  radius: 10,
  height: 1,
  frame:1,
  radialSegments: 60,
  greeceOffset: 1,
  cylinderHeight: 0.1,
  cylinderOffset: 1.5,
  cylinderRadiusTop: 0.4,
  cylinderRadiusBottom: 0.7,
  blobHeightOffset: 1,
  twelvePosition : 30,
  twelvePositionHeight: 2,
  mediumTickHeight: 1,
  smallTickHeight:0.5,
  allTicks: 60,
  tickWidth: 0.2,
  ticksWidthSegments: 0.09,
  blobOffset: 0.4,
  frontSideOffset: 0.5,
  backSideOffset: 0.1
};

const handDefaults = {
  hourHandRadius: 5,
  minutesHandRadius: 5,
  secondsHandRadius: 4.5,
  handsWidthSegments: 16,
  handsHeightSegments: 16,
  hoursHandPosition: 1.2,
  minutesHandPosition: 0.8,
  secondsHandPosition: 1.5,
  hoursHandScaleX: 0.04,
  hoursHandScaleY: 0.04,
  hoursHandScaleZ: 0.6,
  minutesHandScaleX: 0.04,
  minutesHandScaleY: 0.04,
  minutesHandScaleZ: 1,
  secondsHandScaleX: 0.02,
  secondsHandScaleY: 0.02,
  secondsHandScaleZ: 1.4,
  hoursHandTranslationX: 0,
  hoursHandTranslationY: 0,
  hoursHandTranslationZ: 2,
  minutesHandTranslationX: 0,
  minutesHandTranslationY: 0,
  minutesHandTranslationZ: 3,
  secondsHandTranslationX: 0,
  secondsHandTranslationY: 0,
  secondsHandTranslationZ: 3
};

const generalDefaults = {
  resetKey: 82,
  cameraRotateSpeed: 2,
  cameraPositionX: 0.1,
  cameraPositionY: 15,
  cameraPositionZ: 0,
  lightPositionX: 1.5,
  lightPositionY: 1,
  lightPositionZ: 1,
  imageFrontSide: "images/germany.jpg",
  imageBackSide: "images/greece.jpg"
};

const colors = {
  yellow: 0xffff00,
  cyan: 0x00f5f0,
  green: 0x0f5f00,
  blackRock: 0x2D303D,
  black: "black",
  red: "red",
  charcoal: 0x444444,
  suvaGrey: 0x909090,
  white: 0xffffff,
  background: "rgb(153, 255, 204)"
};

const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(colors.background);

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( generalDefaults.cameraPositionX, generalDefaults.cameraPositionY, generalDefaults.cameraPositionZ);

//Add light
const ambientLight = new THREE.AmbientLight(colors.suvaGrey);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(colors.charcoal);
light.position.set( generalDefaults.lightPositionX, generalDefaults.lightPositionY, generalDefaults.lightPositionZ);
scene.add(light);

const txtLoader = new THREE.TextureLoader();

let geometryFrontSide = new THREE.CylinderGeometry( clockDefaults.radius - clockDefaults.cylinderOffset, clockDefaults.radius, clockDefaults.cylinderHeight, clockDefaults.radialSegments );
const frontSideTexture = txtLoader.load(generalDefaults.imageFrontSide);
let materialFrontSide = new THREE.MeshBasicMaterial( {color: colors.white, map:frontSideTexture, side: THREE.FrontSide} );
let cylinderFrontSide = new THREE.Mesh( geometryFrontSide, materialFrontSide );
cylinderFrontSide.position.y += clockDefaults.cylinderHeight;
cylinderFrontSide.rotation.set( 0, Math.PI, 0);
scene.add( cylinderFrontSide );

let geometryBackSide = new THREE.CylinderGeometry( clockDefaults.radius - clockDefaults.cylinderOffset, clockDefaults.radius, clockDefaults.cylinderHeight, clockDefaults.radialSegments );
const backSideTexture = txtLoader.load(generalDefaults.imageBackSide);
let materialBackSide = new THREE.MeshBasicMaterial( {color: colors.white, map:backSideTexture, side: THREE.BackSide} );
let cylinderBackSide = new THREE.Mesh( geometryBackSide, materialBackSide );
cylinderBackSide.position.y -= clockDefaults.cylinderHeight;
cylinderBackSide.rotation.set( 0, Math.PI/2, 0);
scene.add( cylinderBackSide );

//Blobs
let geometryBlobFrontSide = new THREE.CylinderGeometry( clockDefaults.cylinderRadiusTop, clockDefaults.cylinderRadiusBottom, clockDefaults.height + clockDefaults.blobHeightOffset, clockDefaults.radialSegments );
let materialBlobFrontSide = new THREE.MeshBasicMaterial( {color: colors.charcoal} );
let blobFrontSide = new THREE.Mesh( geometryBlobFrontSide, materialBlobFrontSide );
blobFrontSide.position.y += clockDefaults.height - clockDefaults.blobOffset;
cylinderFrontSide.add( blobFrontSide );

let geometryBlobBackSide = new THREE.CylinderGeometry( clockDefaults.cylinderRadiusTop, clockDefaults.cylinderRadiusBottom, clockDefaults.height + clockDefaults.blobHeightOffset, clockDefaults.radialSegments );
let materialBlobBackSide = new THREE.MeshBasicMaterial( {color: colors.charcoal} );
let blobBackSide = new THREE.Mesh( geometryBlobBackSide, materialBlobBackSide );
blobBackSide.position.y -= clockDefaults.height - clockDefaults.blobOffset;
blobBackSide.rotation.set(0, 0, Math.PI);
cylinderBackSide.add( blobBackSide );

for(let i=0; i<clockDefaults.allTicks; i++) {
  //In the following lines, we subtract pi/2 in order to correct where the 12 o'clock is,
  // because of the rotation needed for the texture image to be correct
  if(i === clockDefaults.twelvePosition) createTicks(cylinderFrontSide, clockDefaults.tickWidth, clockDefaults.twelvePositionHeight, colors.red, ((2*Math.PI)/60) * i - Math.PI/2, clockDefaults.frontSideOffset);
  else if(i%5 === 0) createTicks(cylinderFrontSide, clockDefaults.tickWidth, clockDefaults.mediumTickHeight, colors.black, ((2*Math.PI)/60) * i - Math.PI/2, clockDefaults.frontSideOffset);
  else createTicks(cylinderFrontSide, clockDefaults.tickWidth, clockDefaults.smallTickHeight, colors.black, ((2*Math.PI)/60) * i - Math.PI/2, clockDefaults.frontSideOffset);
}
for(let i=0; i<clockDefaults.allTicks; i++) {
  if(i === clockDefaults.twelvePosition) createTicks(cylinderBackSide, clockDefaults.tickWidth, clockDefaults.twelvePositionHeight, colors.red, ((2*Math.PI)/60) * i, -clockDefaults.backSideOffset);
  else if(i%5 === 0) createTicks(cylinderBackSide, clockDefaults.tickWidth, clockDefaults.mediumTickHeight, colors.black, ((2*Math.PI)/60) * i, -clockDefaults.backSideOffset);
  else createTicks(cylinderBackSide, clockDefaults.tickWidth, clockDefaults.smallTickHeight, colors.black, ((2*Math.PI)/60) * i, -clockDefaults.backSideOffset);
}

function createTicks(cylinder, tickWidth, height, color, angle, side) {
  const lineGeometry = new THREE.BoxGeometry(tickWidth, height, clockDefaults.ticksWidthSegments);
  const tick = new THREE.Mesh(lineGeometry, new THREE.MeshPhongMaterial({color: color}));
  tick.position.z = Math.cos(angle)*( clockDefaults.radius - 0.6);
  tick.position.y = side;
  tick.position.x = Math.sin(angle)*( clockDefaults.radius - 0.6);
  tick.rotateY(angle);
  tick.rotateX(Math.PI/2);
  cylinder.add(tick);
}

//Front Side
let geometryHoursHandFrontSide = new THREE.SphereGeometry( handDefaults.hourHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments);
geometryHoursHandFrontSide.scale( handDefaults.hoursHandScaleX, handDefaults.hoursHandScaleY, handDefaults.hoursHandScaleZ);
geometryHoursHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.hoursHandTranslationX, handDefaults.hoursHandTranslationY, handDefaults.hoursHandTranslationZ));
let materialHoursHandFrontSide = new THREE.MeshBasicMaterial( {color: colors.green} );
let hourHandFrontSide = new THREE.Mesh( geometryHoursHandFrontSide, materialHoursHandFrontSide );
hourHandFrontSide.position.y = handDefaults.hoursHandPosition;
scene.add( hourHandFrontSide );

let geometryMinutesHandFrontSide = new THREE.SphereGeometry( handDefaults.minutesHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments );
geometryMinutesHandFrontSide.scale( handDefaults.minutesHandScaleX, handDefaults.minutesHandScaleY, handDefaults.minutesHandScaleZ);
geometryMinutesHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.minutesHandTranslationX, handDefaults.minutesHandTranslationY, handDefaults.minutesHandTranslationZ));
let materialMinutesHandFrontSide = new THREE.MeshBasicMaterial( {color: colors.yellow} );
let minutesHandFrontSide = new THREE.Mesh( geometryMinutesHandFrontSide, materialMinutesHandFrontSide );
minutesHandFrontSide.position.y = handDefaults.minutesHandPosition;
scene.add( minutesHandFrontSide );

let geometrySecondsHandFrontSide = new THREE.SphereGeometry( handDefaults.secondsHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments );
geometrySecondsHandFrontSide.scale( handDefaults.secondsHandScaleX, handDefaults.secondsHandScaleY, handDefaults.secondsHandScaleZ);
geometrySecondsHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.secondsHandTranslationX, handDefaults.secondsHandTranslationY, handDefaults.secondsHandTranslationZ));
let materialSecondsHandFrontSide = new THREE.MeshBasicMaterial( {color: colors.cyan} );
let secondsHandFrontSide = new THREE.Mesh( geometrySecondsHandFrontSide, materialSecondsHandFrontSide );
secondsHandFrontSide.position.y = handDefaults.secondsHandPosition;
scene.add( secondsHandFrontSide );

//Back Side
let geometryHoursHandBackSide = new THREE.SphereGeometry(handDefaults.hourHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments);
geometryHoursHandBackSide.scale( handDefaults.hoursHandScaleX, handDefaults.hoursHandScaleY, handDefaults.hoursHandScaleZ);
geometryHoursHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.hoursHandTranslationX, handDefaults.hoursHandTranslationY, handDefaults.hoursHandTranslationZ));
let materialHoursHandBackSide = new THREE.MeshBasicMaterial( {color: colors.green} );
let hourHandBackSide = new THREE.Mesh( geometryHoursHandBackSide, materialHoursHandBackSide );
hourHandBackSide.position.y = -handDefaults.hoursHandPosition;
scene.add( hourHandBackSide );

let geometryMinutesHandBackSide = new THREE.SphereGeometry( handDefaults.minutesHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments );
geometryMinutesHandBackSide.scale( handDefaults.minutesHandScaleX, handDefaults.minutesHandScaleY, handDefaults.minutesHandScaleZ);
geometryMinutesHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.minutesHandTranslationX, handDefaults.minutesHandTranslationY, handDefaults.minutesHandTranslationZ));
let materialMinutesHandBackSide = new THREE.MeshBasicMaterial( {color: colors.yellow} );
let minutesHandBackSide = new THREE.Mesh( geometryMinutesHandBackSide, materialMinutesHandBackSide );
minutesHandBackSide.position.y = -handDefaults.minutesHandPosition;
scene.add( minutesHandBackSide );

let geometrySecondsHandBackSide = new THREE.SphereGeometry( handDefaults.secondsHandRadius, handDefaults.handsWidthSegments, handDefaults.handsHeightSegments );
geometrySecondsHandBackSide.scale( handDefaults.secondsHandScaleX, handDefaults.secondsHandScaleY, handDefaults.secondsHandScaleZ);
geometrySecondsHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation( handDefaults.secondsHandTranslationX, handDefaults.secondsHandTranslationY, handDefaults.secondsHandTranslationZ));
let materialSecondsHandBackSide = new THREE.MeshBasicMaterial( {color: colors.cyan} );
let secondsHandBackSide = new THREE.Mesh( geometrySecondsHandBackSide, materialSecondsHandBackSide );
secondsHandBackSide.position.y = -handDefaults.secondsHandPosition;
scene.add( secondsHandBackSide );

//Outter Ring
let points = [];
points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
points.push(new THREE.Vector2(clockDefaults.radius , clockDefaults.height/2 - clockDefaults.frame));
points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 - clockDefaults.frame));
points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 + clockDefaults.frame));
points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
let mesh = new THREE.Mesh( new THREE.LatheGeometry( points, 60 ), new THREE.MeshLambertMaterial( { color: colors.blackRock,  flatShading: THREE.FlatShading } ));
mesh.doubleSided = true;
scene.add( mesh );

const controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = generalDefaults.cameraRotateSpeed;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  let keyCode = event.which;

  if (keyCode == generalDefaults.resetKey) {
    controls.reset();
  }
}

function render(time) {
  requestAnimationFrame(render);

  const date = new Date();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let handSecondsFrontSide = ((2*Math.PI)/60) * seconds + Math.PI/2;
  let handMinutesFrontSide = ((2*Math.PI)/60) * minutes + Math.PI/2;
  let handHoursFrontSide = ((2*Math.PI)/12) * hours + Math.PI/2 + (((6 * minutes / 12 )* Math.PI) / 180);

  secondsHandFrontSide.rotation.y = -handSecondsFrontSide;
  hourHandFrontSide.rotation.y = -handHoursFrontSide;
  minutesHandFrontSide.rotation.y = -handMinutesFrontSide;

  let handSecondsBackSide = ((2*Math.PI)/60) * seconds + Math.PI/2 + Math.PI;
  let handMinutesBackSide = ((2*Math.PI)/60) * minutes + Math.PI/2  + Math.PI;
  let handHoursBackSide = ((2*Math.PI)/12) * (hours + clockDefaults.greeceOffset ) + (((6 * minutes / 12 )* Math.PI) / 180) - Math.PI/2;

  secondsHandBackSide.rotation.y = handSecondsBackSide;
  hourHandBackSide.rotation.y = handHoursBackSide;
  minutesHandBackSide.rotation.y = handMinutesBackSide;

  controls.update();
  renderer.render(scene, camera);
}

render();
