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
	5000); // far — Camera frustum far plane. 

var camHolder = new THREE.Group();
camHolder.add(camera);
camHolder.position.set(0,5,20);
scene.add(camHolder);

var speedTrans = 200;
var speedRot = THREE.Math.degToRad(45);

var clock = new THREE.Clock();
var delta = 0;
var noClip = false;
var camNoClip;

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

	//no clip mode
	if(evt.keyCode == 27){
		if(!noClip){
			camNoClip = camHolder;
		}else{
			camHolder = camNoClip;
		}
		noClip = !noClip;
	}
});


//cube
var geometry = new THREE.BoxGeometry(2,2,2);
//var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function plane(x,y,z,image,repX,repY){
	var planeGeometry = new THREE.BoxGeometry(x,y,z);
	var material = null;
	if(image != ''){
		var texture = new THREE.TextureLoader().load(imagePrefix+image+'.jpg', function(texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set(0,0);
			texture.repeat.set(repX,repY);
		});
		material = new THREE.MeshLambertMaterial({map: texture});
	}else{
		material = new THREE.MeshBasicMaterial({color: 0x000000});
	}
	
	var plane = new THREE.Mesh(planeGeometry,material);
	return plane;
};

//road
var road = plane(40,1,1000,'road',1,5);
scene.add(road);
road.position.set(0,-5,0);

var sideRoad = plane(40,1,1000,'road',1,5);
scene.add(sideRoad);
sideRoad.rotation.y += 90*(Math.PI/180);
sideRoad.position.set(520,-5,0);

var aldiRoad = plane(40,1,40,'road',1,1);
scene.add(aldiRoad);
aldiRoad.rotation.y += 90*(Math.PI/180);
aldiRoad.position.set(40,-5,-400);

//sidewalk
var rightSidewalk1 = plane(20,2,500,'sidewalk',1,15);
rightSidewalk1.position.set(30,-4,270);

var rightSidewalk2 = plane(20,2,360,'sidewalk',1,15);
rightSidewalk2.position.set(30,-4,-200);

var rightSidewalk3 = plane(20,2,80,'sidewalk',1,3);
rightSidewalk3.position.set(30,-4,-460);

var leftSidewalk = plane(20,2,1000,'sidewalk',1,30);
leftSidewalk.position.set(-30,-4,0);

var leftSideRoadSidewalk = plane(20,2,500,'sidewalk',1,15);
leftSideRoadSidewalk.rotation.y += 90*(Math.PI/180);
leftSideRoadSidewalk.position.set(290,-4,-30);

var rightSideRoadSidewalk = plane(20,2,500,'sidewalk',1,15);
rightSideRoadSidewalk.rotation.y += 90*(Math.PI/180);
rightSideRoadSidewalk.position.set(290,-4,30);

var sideWalk = new THREE.Group();
scene.add(sideWalk);

sideWalk.add(
	rightSidewalk1,
	rightSidewalk2,
	rightSidewalk3,
	leftSidewalk,
	leftSideRoadSidewalk,
	rightSideRoadSidewalk
)

//grass
var grass = plane(5000,1,5000,'grass',80,100);
scene.add(grass);
grass.position.set(0,-6,0);

//Aldi sign
var sign = new THREE.Group();
scene.add(sign);
sign.position.set(55,0,-450);
sign.scale.set(0.5,0.5,0.5);

//pole of the sign
var poleGeometry = new THREE.BoxGeometry(10,85,8);
var material = new THREE.MeshBasicMaterial({color: 0x000000});
var pole = new THREE.Mesh(poleGeometry,material);
pole.position.set(0,31,0);

//main square of the sign
var signCubeGeometry = new THREE.BoxGeometry(30,40,12);
var material = new THREE.MeshBasicMaterial({color: 0x7a7a7a});
var signCube = new THREE.Mesh(signCubeGeometry,material);
signCube.position.set(-8,50,0);

//The aldi logo on the sign
var loader = new THREE.FontLoader();
loader.load( imagePrefix+'font.json', function ( font ) {

	var logoGeometry = new THREE.TextGeometry( 'A', {
		font: font,
		size: 32,
		height: 1,
		curveSegments: 12,
		bevelEnabled: false
	} );

	var material = new THREE.MeshLambertMaterial({color: 0x0000ff})
	var logo = new THREE.Mesh(logoGeometry,material);
	logo.position.set(-17,39,6);
	var logoBackside = logo.clone();
	logoBackside.rotation.y = 180*(Math.PI/180);
	logoBackside.position.set(3,39,-6);

	var logoGeometryWord = new THREE.TextGeometry('aldi',{
		font:font,
		size: 6,
		height: 1,
		curveSegments:12,
		bevelEnabled: false
	});

	var material = new THREE.MeshLambertMaterial({color: 0x0000ff})
	var logoWord = new THREE.Mesh(logoGeometryWord,material);
	logoWord.position.set(-14,33,6);
	var logoBacksideWord = logoWord.clone();
	logoBacksideWord.rotation.y = 180*(Math.PI/180);
	logoBacksideWord.position.set(2,33,-6);

	sign.add(
		logo,
		logoBackside,
		logoWord,
		logoBacksideWord
	);
} );

sign.add(
	pole,
	signCube
)
//parkinglot of aldi
var parkingLot = plane(200,2,150,'parkingLot',1,1);
scene.add(parkingLot);
parkingLot.rotation.y += 90*(Math.PI/180);
parkingLot.position.set(135,-5,-400);

<<<<<<< HEAD
//aldi building
var aldiBuilding = new THREE.Group();
scene.add(aldiBuilding);
aldiBuilding.position.set(310,-5,-400);

//main part of the building
var mainCube = plane(150,30,160,'damagedTile',2,1);
mainCube.position.set(10,15,0);

//baseground of building
var concretePlane = plane(200,2,200,'concrete',5,5);

//overhang of entrance
var overHangEntrance = plane(15,5,90,'aluminiumPanel',3,1);
overHangEntrance.position.set(-72.5,17.5,-35);

//extension of the entrance
var extraCube = plane(15,20,70,'damagedTile',1,1);
extraCube.position.set(-72.5,10,45);

//roof of extention and overhang
var lowerRoof = plane(15,1,160,'',1,1);
lowerRoof.position.set(-72.5,20.5,0);

//roof of mainCube
var upperRoof = plane(150,1,160,'',1,1);
upperRoof.position.set(10,30,0);

//broken windows
var window1 = plane(22,1,15,'brokenGlass',1,1);
window1.rotation.z += 90*(Math.PI/180);
window1.rotation.x += 90*(Math.PI/180);
window1.position.set(-65,10,-25);

var window2 = plane(22,1,15,'brokenGlass',1,1);
window2.rotation.z += 90*(Math.PI/180);
window2.rotation.x += 90*(Math.PI/180);
window2.position.set(-65,10,0);

var doubleDoor = plane(40,1,18,'glassDoubleDoor',1,1);
doubleDoor.rotation.z += 90*(Math.PI/180);
doubleDoor.rotation.x += 90*(Math.PI/180);
doubleDoor.position.set(-65,10,-60);

//logos of the aldi on the building
var loader = new THREE.FontLoader();
loader.load( imagePrefix+'font.json', function ( font ) {

	var logoGeometry = new THREE.TextGeometry( 'A', {
		font: font,
		size: 16,
		height: 1,
		curveSegments: 12,
		bevelEnabled: false
	} );

	var material = new THREE.MeshLambertMaterial({color: 0x0000ff})
	var logo = new THREE.Mesh(logoGeometry,material);
	logo.position.set(-80,4,40);
	logo.rotation.y -= 90*(Math.PI/180);

	var logoGeometryWord = new THREE.TextGeometry('aldi',{
		font:font,
		size: 5,
		height: 1,
		curveSegments:12,
		bevelEnabled: false
	});

	var material = new THREE.MeshLambertMaterial({color: 0x0000ff})
	var logoWord = new THREE.Mesh(logoGeometryWord,material);
	logoWord.position.set(-80,15.5,-70);
	logoWord.rotation.y -= 90*(Math.PI/180);

	aldiBuilding.add(
		logo,
		logoWord,
	)
});

aldiBuilding.add(
	mainCube,
	concretePlane,
	overHangEntrance,
	extraCube,
	lowerRoof,
	upperRoof,
	window1,
	window2,
	doubleDoor,
)
=======
//Trees
var trees = new THREE.Group();

var treeGeometries = new THREE.Tree({
    generations : 4,        // # for branch' hierarchy
    length      : 15.0,      // length of root branch
    uvLength    : 8.0,     // uv.v ratio against geometry length (recommended is generations * length)
    radius      : 0.8,      // radius of root branch
    radiusSegments : 8,     // # of radius segments for each branch geometry
    heightSegments : 8      // # of height segments for each branch geometry
});

var treeGeometry = THREE.TreeGeometry.build(treeGeometries);
var tree = new THREE.Mesh( treeGeometry, new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( imagePrefix+'treePattern.png' ) } ) );
tree.position.set(-45, -6, 0);

var tree1 = tree.clone();
tree1.rotation.y = 0.5;
tree1.position.set(-45, -6, -40);

var tree2 = tree.clone();
tree2.rotation.y = 0.75;
tree2.position.set(-45, -6, -80);

var tree3 = tree.clone();
tree3.rotation.y = 0.1;
tree3.position.set(-45, -6, -120);

trees.add(
	tree,
	tree1,
	tree2,
	tree3
	);
scene.add(trees);

>>>>>>> 85d5c19dc5f6770ab4ba8e6d9a1cf09643aa1459

//ambientlight
var light = new THREE.AmbientLight(0x6e0f02,1);
scene.add(light);

//spotlight
var keyLight = new THREE.DirectionalLight(0xdddddd, 1);
keyLight.position.set(-80, 80, 80);
scene.add(keyLight);

//lighthelper
var keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 15);
scene.add(keyLightHelper);


var render = function(){
	requestAnimationFrame(render);
	delta = clock.getDelta();

	cube.rotation.x += 0.3 * delta;
	cube.rotation.y += 0.3 * delta;

	if(noClip){
		controls.update();
	}

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

//viewport rezising
window.addEventListener( 'resize', function(  ) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
} );

render();

document.body.appendChild(renderer.domElement);
