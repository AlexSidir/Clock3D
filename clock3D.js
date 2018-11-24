const clockDefaults = {
  radius: 10,
  height: 1,
  radialSegments: 60,
  frame:1
};

const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(178,34,34)');
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,
  0.1, 1000);
  camera.position.z = 15;

  //Add light
  const ambientLight = new THREE.AmbientLight(0x909090);
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight(0x444444);
  light.position.set( 1.5,1,1 );
  scene.add(light);

  var geometry = new THREE.CylinderGeometry( clockDefaults.radius-1, clockDefaults.radius, clockDefaults.height/2, clockDefaults.radialSegments );
  var frontSideTexture = new THREE.ImageUtils.loadTexture("germany.jpg");
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map:frontSideTexture, side: THREE.FrontSide} );
  var cylinderGermany = new THREE.Mesh( geometry, material );
  cylinderGermany.position.z += clockDefaults.height/3;
  cylinderGermany.rotation.set( Math.PI/2,Math.PI/2,0);
  scene.add( cylinderGermany );

  var geometry = new THREE.CylinderGeometry( clockDefaults.radius-1, clockDefaults.radius, clockDefaults.height/2, clockDefaults.radialSegments );
  var backSideTexture = new THREE.ImageUtils.loadTexture("greece.jpg");
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map:backSideTexture, side: THREE.BackSide} );
  var cylinderGreece = new THREE.Mesh( geometry, material );
  cylinderGreece.position.z -= clockDefaults.height/3;
  cylinderGreece.rotation.set( Math.PI/2, 0,0);
  scene.add( cylinderGreece );


/*
var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:backSideTexture, side: THREE.BackSide} );
let materials = [material, material2];
*/
  var geometry = new THREE.CylinderGeometry( 0.4, 0.7, clockDefaults.height + 1, clockDefaults.radialSegments );
  var material = new THREE.MeshBasicMaterial( {color: 0x444444} );
  var middlePoint = new THREE.Mesh( geometry, material );
  middlePoint.position.y += clockDefaults.height - 0.4;
  cylinderGermany.add( middlePoint );

  var geometry = new THREE.CylinderGeometry( 0.4, 0.7, clockDefaults.height + 1, clockDefaults.radialSegments );
  var material = new THREE.MeshBasicMaterial( {color: 0x444444} );
  var middlePoint = new THREE.Mesh( geometry, material );
  middlePoint.position.y -= clockDefaults.height - 0.4;
  middlePoint.rotation.set(0, 0, Math.PI);
  cylinderGreece.add( middlePoint );

  for(let i=0; i<60; i++){
    const frontAngle = ((2*Math.PI)/60) * i - Math.PI/2;//We subtract pi/2 in order to correct where the 12 o'clock is,
                                                        // because of the rotation needed for the texture image to be correct
    const frontSide =  1 / 2;

    if(i === 30) createTicks(cylinderGermany, 0.2, 1.5, "red", frontAngle, frontSide);
    else if(i%5 === 0) createTicks(cylinderGermany, 0.2, 1, "black", frontAngle, frontSide);
    else createTicks(cylinderGermany, 0.2, 0.5, "black", frontAngle, frontSide);
  }
  for(let i=0; i<60; i++){
    const backAngle = ((2*Math.PI)/60) * i;
    const backSide =  - 1 / 2;

    if(i === 30) createTicks(cylinderGreece, 0.2, 1.5, "red", backAngle, backSide);
    else if(i%5 === 0) createTicks(cylinderGreece, 0.2, 1, "black", backAngle, backSide);
    else createTicks(cylinderGreece, 0.2, 0.5, "black", backAngle, backSide);
  }

  function createTicks(container, width, height, color, angle, side){

    const lineGeometry = new THREE.BoxGeometry(width, height, 0.08);
    const line = new THREE.Mesh(lineGeometry, new THREE.MeshPhongMaterial({color: color}));
    line.position.z = Math.cos(angle)*( 10 - 0.6);
    line.position.y = side;
    line.position.x = Math.sin(angle)*( 10 - 0.6);
    line.rotateY(angle);
    line.rotateX(Math.PI/2);
    container.add(line);
  }
  createFrontSideHands();
  createBackSideHands();
  function createBackSideHands() {
    var geometry = new THREE.SphereGeometry( 5, 16, 16 );
    geometry.scale(0.04,0.04,1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var hourHand = new THREE.Mesh( geometry, material );
    hourHand.position.z = -0.8;
    hourHand.rotation.y = Math.PI /2;
    hourHand.position.x = 3;
    scene.add( hourHand );

    var geometry = new THREE.SphereGeometry( 5, 16, 16 );
    geometry.scale(0.04,0.04,0.6);
    var material = new THREE.MeshBasicMaterial( {color: 0x0f5f00} );
    var minutesHand = new THREE.Mesh( geometry, material );
    minutesHand.position.z = -1.2;
    minutesHand.rotation.y = Math.PI /2;
    minutesHand.position.x = 2;
    scene.add( minutesHand );

    var geometry = new THREE.SphereGeometry( 4.5, 16, 16 );
    geometry.scale(0.02,0.02,1.4);
    var material = new THREE.MeshBasicMaterial( {color: 0x00f5f0} );
    var secondsHand = new THREE.Mesh( geometry, material );
    secondsHand.position.z = -1.5;
    secondsHand.rotation.y = Math.PI /2;
    secondsHand.position.x = 3;
    scene.add( secondsHand );
  }
  function createFrontSideHands() {
    var geometry = new THREE.SphereGeometry( 5, 16, 16 );
    geometry.scale(0.04,0.04,1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var hourHand = new THREE.Mesh( geometry, material );
    hourHand.position.z = 0.8;
    hourHand.rotation.y = Math.PI /2;
    hourHand.position.x = 3;
    scene.add( hourHand );

    var geometry = new THREE.SphereGeometry( 5, 16, 16 );
    geometry.scale(0.04,0.04,0.6);
    var material = new THREE.MeshBasicMaterial( {color: 0x0f5f00} );
    var minutesHand = new THREE.Mesh( geometry, material );
    minutesHand.position.z = 1.2;
    minutesHand.rotation.y = Math.PI /2;
    minutesHand.position.x = 2;
    scene.add( minutesHand );

    var geometry = new THREE.SphereGeometry( 4.5, 16, 16 );
    geometry.scale(0.02,0.02,1.4);
    var material = new THREE.MeshBasicMaterial( {color: 0x00f5f0} );
    var secondsHand = new THREE.Mesh( geometry, material );
    secondsHand.position.z = 1.5;
    secondsHand.rotation.y = Math.PI /2;
    secondsHand.position.x = 3;
    scene.add( secondsHand );
  }


  const gaps = 60;
  const hours = 12;

  //Outter Ring
  var points = [];
  points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius , clockDefaults.height/2 - clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 - clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 + clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
  var mesh = new THREE.Mesh( new THREE.LatheGeometry( points, 60 ), new THREE.MeshLambertMaterial( { color: 0x2D303D,  shading: THREE.FlatShading } ));
  mesh.position.y = 0;
  mesh.position.z = -0.5;
  //mesh.overdraw = true;
  mesh.doubleSided = true;
  mesh.rotation.set(Math.PI/2,0,0);
  scene.add( mesh );

  const controls = new THREE.TrackballControls( camera, canvas );
  controls.rotateSpeed = 2;

  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    let keyCode = event.which;

    if (keyCode == 82) {
      controls.reset();
    }
  }
  function render() {
    requestAnimationFrame(render);

    //i = i + 0.01;
    //bigHand.rotation.set(0,i,0);
    controls.update();
    renderer.render(scene, camera);
  }

  render();
