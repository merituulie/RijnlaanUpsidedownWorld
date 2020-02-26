// Create scene
var scene = new THREE.Scene();

//skybox
var imagePrefix = "Assets/"
var directions  = ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"];
var materialArray = [];
for (var i = 0; i < 6; i++)
{
   materialArray.push(
      new THREE.MeshBasicMaterial({
         map: new THREE.TextureLoader().load(imagePrefix + directions[i]),
         side: THREE.BackSide})
  );
}
	
var skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000);	
//var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
var skyBox = new THREE.Mesh(skyGeometry, materialArray);
scene.add(skyBox);

// Create camera
var camera = new THREE.PerspectiveCamera(
	60, // fov — Camera frustum vertical field of view.
	window.innerWidth/window.innerHeight, // aspect — Camera frustum aspect ratio.
	0.1, // near — Camera frustum near plane.
	1000); // far — Camera frustum far plane. 

var camHolder = new THREE.Group();
camHolder.add(camera);
camHolder.position.set(0,5,20);
scene.add(camHolder);

var speedTrans = 20;
var speedRot = THREE.Math.degToRad(45);

var clock = new THREE.Clock();
var delta = 0;

document.addEventListener('keydown', function(evt) {

	if (evt.keyCode === 87) {
	  camHolder.translateZ(-speedTrans * delta);
	} // w fast vorward
	if (evt.keyCode === 83) {
	  camHolder.translateZ( speedTrans * delta);
	} // s backward a little slower
	if (evt.keyCode === 65) {
	  camHolder.translateX(-speedTrans * delta);
	} // a slowly leftwards
	if (evt.keyCode === 68) {
	  camHolder.translateX( speedTrans * delta);
	} // d slowly rightwards
  
	if (evt.keyCode === 84) {
	  camHolder.translateY(speedTrans * delta);
	} // t upstretch
	if (evt.keyCode === 66) {
	  camHolder.translateY(-speedTrans * delta);
	} // b bend down

	if (evt.keyCode === 37) {
		camHolder.rotateY(speedRot * delta);
	  } // left arrow, turn to the left
	if (evt.keyCode === 38) {
	  	camera.rotation.x += speedRot * delta;
	} // up arrow, looking higher
	if (evt.keyCode === 39) {
		camHolder.rotateY(-speedRot * delta);
	  } // right arrow, turn to the right
	if (evt.keyCode === 40) {
	  	camera.rotation.x += -speedRot * delta;
	} // down arrow, looking deeper

});


//cube
var geometry = new THREE.BoxGeometry(2,2,2);
//var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//ground
var planeGeometry = new THREE.BoxGeometry(5000,1,5000);
var material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(imagePrefix+'Cement.jpg')});
var plane = new THREE.Mesh(planeGeometry,material);
scene.add(plane);
plane.position.set(0,-5,0);

//ambientlight
//var light = new THREE.AmbientLight(0xd93616);
//scene.add(light);

//spotlight
keyLight = new THREE.DirectionalLight(0xdddddd, 1);
keyLight.position.set(-80, 80, 80);
scene.add(keyLight);

//lighthelper
keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 15);
scene.add(keyLightHelper);


var render = function(){
	requestAnimationFrame(render);
	delta = clock.getDelta();

	cube.rotation.x += 0.3 * delta;
	cube.rotation.y += 0.3 * delta;
	
	controls.update();
	renderer.render(scene, camera);	
}

//controls
controls = new THREE.OrbitControls(camera); 
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.noKeys = true;

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

render();

document.body.appendChild(renderer.domElement);
