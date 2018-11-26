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
  camera.position.set( 0.1, 20, 0);

  //Add light
  const ambientLight = new THREE.AmbientLight(0x909090);
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight(0x444444);
  light.position.set( 1.5,1,1 );
  scene.add(light);

  const txtLoader = new THREE.TextureLoader();

  let geometryFrontSide = new THREE.CylinderGeometry( clockDefaults.radius-1, clockDefaults.radius, clockDefaults.height/2, clockDefaults.radialSegments );
  const frontSideTexture = txtLoader.load("germany.jpg");
  let materialFrontSide = new THREE.MeshBasicMaterial( {color: 0xffffff, map:frontSideTexture, side: THREE.FrontSide} );
  let cylinderFrontSide = new THREE.Mesh( geometryFrontSide, materialFrontSide );
  cylinderFrontSide.position.y += clockDefaults.height/3;
  cylinderFrontSide.rotation.set( 0, Math.PI,0);
  scene.add( cylinderFrontSide );

  let geometryBackSide = new THREE.CylinderGeometry( clockDefaults.radius-1, clockDefaults.radius, clockDefaults.height/2, clockDefaults.radialSegments );
  const backSideTexture = txtLoader.load("greece.jpg");
  let materialBackSide = new THREE.MeshBasicMaterial( {color: 0xffffff, map:backSideTexture, side: THREE.BackSide} );
  let cylinderBackSide = new THREE.Mesh( geometryBackSide, materialBackSide );
  cylinderBackSide.position.y -= clockDefaults.height/3;
  cylinderBackSide.rotation.set(0 , Math.PI/2,0);
  scene.add( cylinderBackSide );

  let geometryBlobFrontSide = new THREE.CylinderGeometry( 0.4, 0.7, clockDefaults.height + 1, clockDefaults.radialSegments );
  let materialBlobFrontSide = new THREE.MeshBasicMaterial( {color: 0x444444} );
  let blobFrontSide = new THREE.Mesh( geometryBlobFrontSide, materialBlobFrontSide );
  blobFrontSide.position.y += clockDefaults.height - 0.4;
  cylinderFrontSide.add( blobFrontSide );

  let geometryBlobBackSide = new THREE.CylinderGeometry( 0.4, 0.7, clockDefaults.height + 1, clockDefaults.radialSegments );
  let materialBlobBackSide = new THREE.MeshBasicMaterial( {color: 0x444444} );
  let blobBackSide = new THREE.Mesh( geometryBlobBackSide, materialBlobBackSide );
  blobBackSide.position.y -= clockDefaults.height - 0.4;
  blobBackSide.rotation.set(0, 0, Math.PI);
  cylinderBackSide.add( blobBackSide );

  for(let i=0; i<60; i++){
    const frontAngle = ((2*Math.PI)/60) * i - Math.PI/2;//We subtract pi/2 in order to correct where the 12 o'clock is,
                                                        // because of the rotation needed for the texture image to be correct
    const frontSide =  1 / 2;

    if(i === 30) createTicks(cylinderFrontSide, 0.2, 1.5, "red", frontAngle, frontSide);
    else if(i%5 === 0) createTicks(cylinderFrontSide, 0.2, 1, "black", frontAngle, frontSide);
    else createTicks(cylinderFrontSide, 0.2, 0.5, "black", frontAngle, frontSide);
  }
  for(let i=0; i<60; i++){
    const backAngle = ((2*Math.PI)/60) * i;
    const backSide =  - 1 / 2;

    if(i === 30) createTicks(cylinderBackSide, 0.2, 1.5, "red", backAngle, backSide);
    else if(i%5 === 0) createTicks(cylinderBackSide, 0.2, 1, "black", backAngle, backSide);
    else createTicks(cylinderBackSide, 0.2, 0.5, "black", backAngle, backSide);
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

  let geometryHoursHandFrontSide = new THREE.SphereGeometry( 5, 16, 16 );
  geometryHoursHandFrontSide.scale(0.04,0.04,1);
  geometryHoursHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 3) );
  let materialHoursHandFrontSide = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  let hourHandFrontSide = new THREE.Mesh( geometryHoursHandFrontSide, materialHoursHandFrontSide );
  hourHandFrontSide.position.y = 0.8;
  //hourHandFrontSide.rotation.y = Math.PI /2;
  //hourHandFrontSide.position.z = 3;
  scene.add( hourHandFrontSide );

  let geometryMinutesHandFrontSide = new THREE.SphereGeometry( 5, 16, 16 );
  geometryMinutesHandFrontSide.scale(0.04,0.04,0.6);
  geometryMinutesHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 2) );
  let materialMinutesHandFrontSide = new THREE.MeshBasicMaterial( {color: 0x0f5f00} );
  let minutesHandFrontSide = new THREE.Mesh( geometryMinutesHandFrontSide, materialMinutesHandFrontSide );
  minutesHandFrontSide.position.y = 1.2;
  //minutesHandFrontSide.rotation.y = Math.PI /2;
  //minutesHandFrontSide.position.z = 2;
  scene.add( minutesHandFrontSide );

  let geometrySecondsHandFrontSide = new THREE.SphereGeometry( 4.5, 16, 16 );
  geometrySecondsHandFrontSide.scale(0.02,0.02,1.4);
  geometrySecondsHandFrontSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 3) );
  let materialSecondsHandFrontSide = new THREE.MeshBasicMaterial( {color: 0x00f5f0} );
  let secondsHandFrontSide = new THREE.Mesh( geometrySecondsHandFrontSide, materialSecondsHandFrontSide );
  secondsHandFrontSide.position.y = 1.5;
  //secondsHandFrontSide.rotation.x = Math.PI /2;
//  secondsHandFrontSide.position.z = 0;
  scene.add( secondsHandFrontSide );

  let geometryHoursHandBackSide = new THREE.SphereGeometry( 5, 16, 16 );
  geometryHoursHandBackSide.scale(0.04,0.04,1);
  geometryHoursHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 3) );
  let materialHoursHandBackSide = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  let hourHandBackSide = new THREE.Mesh( geometryHoursHandBackSide, materialHoursHandBackSide );
  hourHandBackSide.position.y = -0.8;
  //hourHandBackSide.rotation.y = Math.PI /2;
  //hourHandBackSide.position.z = 3;
  scene.add( hourHandBackSide );

  let geometryMinutesHandBackSide = new THREE.SphereGeometry( 5, 16, 16 );
  geometryMinutesHandBackSide.scale(0.04,0.04,0.6);
  geometryMinutesHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 2) );
  let materialMinutesHandBackSide = new THREE.MeshBasicMaterial( {color: 0x0f5f00} );
  let minutesHandBackSide = new THREE.Mesh( geometryMinutesHandBackSide, materialMinutesHandBackSide );
  minutesHandBackSide.position.y = -1.2;
  //minutesHandBackSide.rotation.y = Math.PI /2;
  //minutesHandBackSide.position.z = 2;
  scene.add( minutesHandBackSide );

  let geometrySecondsHandBackSide = new THREE.SphereGeometry( 4.5, 16, 16 );
  geometrySecondsHandBackSide.scale(0.02,0.02,1.4);
  geometrySecondsHandBackSide.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 3) );
  let materialSecondsHandBackSide = new THREE.MeshBasicMaterial( {color: 0x00f5f0} );
  let secondsHandBackSide = new THREE.Mesh( geometrySecondsHandBackSide, materialSecondsHandBackSide );
  secondsHandBackSide.position.y = -1.5;
  //secondsHandBackSide.rotation.y = Math.PI /2;
  //secondsHandBackSide.position.z = 3;
  scene.add( secondsHandBackSide );

  //Outter Ring
  let points = [];
  points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius , clockDefaults.height/2 - clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 - clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius + clockDefaults.frame , clockDefaults.height/2 + clockDefaults.frame));
  points.push(new THREE.Vector2(clockDefaults.radius, clockDefaults.height/2 + clockDefaults.frame));
  let mesh = new THREE.Mesh( new THREE.LatheGeometry( points, 60 ), new THREE.MeshLambertMaterial( { color: 0x2D303D,  shading: THREE.FlatShading } ));
  mesh.position.y = 0;
  mesh.doubleSided = true;
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

    const date = new Date();
    const hour = date.getHours()%12;
    const minute = date.getMinutes();
    const seconds = date.getSeconds();

    var handSecondR = (6 * seconds * Math.PI) / 180;
    var handHourR = (30 * (hour > 12 ? hour - 12 : hour) * Math.PI) / 180;
    var handMinuteR = (6 * minute * Math.PI) / 180;

    secondsHandFrontSide.rotation.y = -handSecondR;
    hourHandFrontSide.rotation.y = -handHourR;
    minutesHandFrontSide.rotation.y = -handMinuteR;
  //  secondsHandBackSide.rotation.y = handSecondR;

    controls.update();
    renderer.render(scene, camera);
  }

  render();
