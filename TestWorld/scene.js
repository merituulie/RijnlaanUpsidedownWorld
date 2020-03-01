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
var loadingSign = false;

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
	var logoBacksideWord = logoWord.clone();
	logoWord.rotation.z -= 50*(Math.PI/180);
	logoWord.position.set(-14,33,6);
	logoBacksideWord.rotation.y = 180*(Math.PI/180);
	logoBacksideWord.position.set(2,33,-6);

	sign.add(
		logo,
		logoBackside,
		logoWord,
		logoBacksideWord
	);

	loadingSign = true;
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
var window1 = plane(22,1,15,'brokenGlassWithFrame',1,1);
window1.rotation.z += 90*(Math.PI/180);
window1.rotation.x += 90*(Math.PI/180);
window1.position.set(-65,10,-25);

var window2 = plane(22,1,15,'brokenGlassWithFrame',1,1);
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

//Big apartmentbuilding
var rijnlaanDorm = new THREE.Group();
scene.add(rijnlaanDorm);
rijnlaanDorm.rotation.y -= 12*(Math.PI/180);
rijnlaanDorm.scale.set(.6,1,1);
rijnlaanDorm.position.set(200,-1,240);

var mainBuildingTop = plane(150,40,250,'weatheredBrick',8,3);
mainBuildingTop.position.set(0,35,0);

var mainBuildingBottom = plane(148,20,250,'greyBrick',8,2);
mainBuildingBottom.position.set(1,5,0);

var sideBlockTop = plane(65,36,30,'damagedWood',2,2);
sideBlockTop.position.set(25,33,-140);

var sideBlockBottom = plane(65,20,30,'greyBrick',2,2);
sideBlockBottom.position.set(25,5,-140);
//roof
var roofMainBuilding = plane(152,1,250,'',1,1);
roofMainBuilding.position.set(0,55.5,0);

var roofSideBuilding = plane(100,1,40, '',1,1);
roofSideBuilding.position.set(25,55,-145);

var roofGeometry = new THREE.BoxGeometry(100,4,40);
var material = new THREE.MeshLambertMaterial({color: 0xbd6202});
var roofSideBuildingExtend = new THREE.Mesh(roofGeometry,material);
roofSideBuildingExtend.position.set(25,53,-145);

//walkway
var walkwayModel = plane(65,1,8,'concrete',1,1);
var walkwayRailingModel = plane(100,5,.5,'',1,1);
var walkwaySideModel = plane(38,1,19,'concrete',1,1);
var walkwayRailingSideModel = plane(40,5,.5,'',1,1);

var walkway1 = walkwayModel.clone();
walkway1.position.set(25,14.5,-159);

var walkway2 = walkwaySideModel.clone();
walkway2.rotation.y += 90*(Math.PI/180);
walkway2.position.set(66,14.5,-144);

var walkway3 = walkwaySideModel.clone();
walkway3.rotation.y += 90*(Math.PI/180);
walkway3.position.set(-17,14.5,-144);

var walkway4 = walkwayModel.clone();
walkway4.position.set(25,27,-159);

var walkway5 = walkwaySideModel.clone();
walkway5.rotation.y += 90*(Math.PI/180);
walkway5.position.set(66,27,-144);

var walkway6 = walkwaySideModel.clone();
walkway6.rotation.y += 90*(Math.PI/180);
walkway6.position.set(-17,27,-144);

var walkway7 = walkwayModel.clone();
walkway7.position.set(25,39.5,-159);

var walkway8 = walkwaySideModel.clone();
walkway8.rotation.y += 90*(Math.PI/180);
walkway8.position.set(66,39.5,-144);

var walkway9 = walkwaySideModel.clone();
walkway9.rotation.y += 90*(Math.PI/180);
walkway9.position.set(-17,39.5,-144);

var walkwayRailing1 = walkwayRailingModel.clone();
walkwayRailing1.position.set(25,17.5,-162);

var walkwayRailing2 = walkwayRailingSideModel.clone();
walkwayRailing2.rotation.y += 90*(Math.PI/180);
walkwayRailing2.position.set(75,17.5,-142.25);

var walkwayRailing3 = walkwayRailingSideModel.clone();
walkwayRailing3.rotation.y += 90*(Math.PI/180);
walkwayRailing3.position.set(-25,17.5,-142.25);

var walkwayRailing4 = walkwayRailingModel.clone();
walkwayRailing4.position.set(25,30,-162);

var walkwayRailing5 = walkwayRailingSideModel.clone();
walkwayRailing5.rotation.y += 90*(Math.PI/180);
walkwayRailing5.position.set(75,30,-142.25);

var walkwayRailing6 = walkwayRailingSideModel.clone();
walkwayRailing6.rotation.y += 90*(Math.PI/180);
walkwayRailing6.position.set(-25,30,-142.25);

var walkwayRailing7 = walkwayRailingModel.clone();
walkwayRailing7.position.set(25,42.5,-162);

var walkwayRailing8 = walkwayRailingSideModel.clone();
walkwayRailing8.rotation.y += 90*(Math.PI/180);
walkwayRailing8.position.set(75,42.5,-142.25);

var walkwayRailing9 = walkwayRailingSideModel.clone();
walkwayRailing9.rotation.y += 90*(Math.PI/180);
walkwayRailing9.position.set(-25,42.5,-142.25);

//door
var door = plane(.5,18,15,'door',1,1);
door.rotation.y += 90*(Math.PI/180);
door.position.set(-20,4,-125);

//dividers of the building
var pillarModel = plane(5,60,5,'weatheredBrick',1,6);
var smallPillarModel = plane(5,20,5,'weatheredBrick',1,2);

var pillarHigh1 = pillarModel.clone();
pillarHigh1.position.set(-73.5,25,-62.5);

var pillarHigh2 = pillarModel.clone();
pillarHigh2.position.set(-73.5,25,0);

var pillarHigh3 = pillarModel.clone();
pillarHigh3.position.set(-73.5,25,62.5);

var smallPillar1 = smallPillarModel.clone();
smallPillar1.position.set(-72.5,5,-93.75);

var smallPillar2 = smallPillarModel.clone();
smallPillar2.position.set(-72.5,5,-31.25);

var smallPillar3 = smallPillarModel.clone();
smallPillar3.position.set(-72.5,5,31.25);

var smallPillar4 = smallPillarModel.clone();
smallPillar4.position.set(-72.5,5,93.75);

//Windows
var windowModel = plane(0.5,15,20,'brokenGlassWithFrame',1,1);
var smallWindowModel = plane(.5,10,15,'brokenGlassWithFrame',1,1);
var smallWindowSideModel = plane(.5,10,30,'brokenGlassWithFrame',1,1);
var smallWindowSide2Model = plane(.5,8,15,'brokenGlassWithFrameSide',1,1,);

var windowFront1 = windowModel.clone();
windowFront1.position.set(-73,5,78); 

var windowFront2 = windowModel.clone();
windowFront2.position.set(-73,5,47);

var windowFront3 = windowModel.clone();
windowFront3.rotation.x += 180*(Math.PI/180);
windowFront3.position.set(-73,5,16);

var windowFront4 = windowModel.clone();
windowFront4.position.set(-73,5,-16);

var windowFront5 = windowModel.clone();
windowFront5.rotation.x += 180*(Math.PI/180);
windowFront5.position.set(-73,5,-47);

var windowFront6 = windowModel.clone();
windowFront6.position.set(-73,5,-78);

var windowFront7 = windowModel.clone();
windowFront7.position.set(-73,5,-109);
///left
var smallWindowFront1 = smallWindowModel.clone();
smallWindowFront1.position.set(-75,23,-76);

var smallWindowFront2 = smallWindowModel.clone();
smallWindowFront2.position.set(-75,35,-85);

var smallWindowFront3 = smallWindowModel.clone();
smallWindowFront3.position.set(-75,47,-76);
///right
var smallWindowFront4 = smallWindowModel.clone();
smallWindowFront4.position.set(-75,23,-49);

var smallWindowFront5 = smallWindowModel.clone();
smallWindowFront5.position.set(-75,35,-40);

var smallWindowFront6 = smallWindowModel.clone();
smallWindowFront6.position.set(-75,47,-49);
///left
var smallWindowFront7 = smallWindowModel.clone();
smallWindowFront7.position.set(-75,23,-13);

var smallWindowFront8 = smallWindowModel.clone();
smallWindowFront8.position.set(-75,35,-22);

var smallWindowFront9 = smallWindowModel.clone();
smallWindowFront9.position.set(-75,47,-13);
///right
var smallWindowFront10 = smallWindowModel.clone();
smallWindowFront10.position.set(-75,23,13);

var smallWindowFront11 = smallWindowModel.clone();
smallWindowFront11.position.set(-75,35,22);

var smallWindowFront12 = smallWindowModel.clone();
smallWindowFront12.position.set(-75,47,13);
///left
var smallWindowFront13 = smallWindowModel.clone();
smallWindowFront13.position.set(-75,23,49);

var smallWindowFront14 = smallWindowModel.clone();
smallWindowFront14.position.set(-75,35,40);

var smallWindowFront15 = smallWindowModel.clone();
smallWindowFront15.position.set(-75,47,49);
///right
var smallWindowFront16 = smallWindowModel.clone();
smallWindowFront16.position.set(-75,23,76);

var smallWindowFront17 = smallWindowModel.clone();
smallWindowFront17.position.set(-75,35,85);

var smallWindowFront18 = smallWindowModel.clone();
smallWindowFront18.position.set(-75,47,76);
///left
var smallWindowFront19 = smallWindowModel.clone();
smallWindowFront19.position.set(-75,23,113);

var smallWindowFront20 = smallWindowModel.clone();
smallWindowFront20.position.set(-75,35,104);

var smallWindowFront21 = smallWindowModel.clone();
smallWindowFront21.position.set(-75,47,113);
//side
var smallWindowSide1 = smallWindowSideModel.clone();
smallWindowSide1.rotation.y += 90*(Math.PI/180);
smallWindowSide1.position.set(-55,21,-125);

var smallWindowSide2 = smallWindowSideModel.clone();
smallWindowSide2.rotation.y += 90*(Math.PI/180);
smallWindowSide2.position.set(-45,33.5,-125);

var smallWindowSide3 = smallWindowSideModel.clone();
smallWindowSide3.rotation.y += 90*(Math.PI/180);
smallWindowSide3.position.set(-45,46,-125);
//sidecube
var smallWindowSide4 = smallWindowSide2Model.clone();
smallWindowSide4.rotation.y += 90*(Math.PI/180);
smallWindowSide4.position.set(23,20,-155);

var smallWindowSide5 = smallWindowSide2Model.clone();
smallWindowSide5.rotation.y += 90*(Math.PI/180);
smallWindowSide5.position.set(23,32.5,-155);

var smallWindowSide6 = smallWindowSide2Model.clone();
smallWindowSide6.rotation.y += 90*(Math.PI/180);
smallWindowSide6.position.set(23,45,-155);

var smallWindowSide7 = smallWindowSide2Model.clone();
smallWindowSide7.rotation.y += 90*(Math.PI/180);
smallWindowSide7.position.set(23,5,-155);

rijnlaanDorm.add(
	mainBuildingTop,
	mainBuildingBottom,
	sideBlockTop,
	sideBlockBottom,
	roofMainBuilding,
	roofSideBuilding,
	roofSideBuildingExtend,
	door,
	pillarHigh1,
	pillarHigh2,
	pillarHigh3,
	smallPillar1,
	smallPillar2,
	smallPillar3,
	smallPillar4,
	windowFront1,
	windowFront2,
	windowFront3,
	windowFront4,
	windowFront5,
	windowFront6,
	windowFront7,
	smallWindowFront1,
	smallWindowFront2,
	smallWindowFront3,
	smallWindowFront4,
	smallWindowFront5,
	smallWindowFront6,
	smallWindowFront7,
	smallWindowFront8,
	smallWindowFront9,
	smallWindowFront10,
	smallWindowFront11,
	smallWindowFront12,
	smallWindowFront13,
	smallWindowFront14,
	smallWindowFront15,
	smallWindowFront16,
	smallWindowFront17,
	smallWindowFront18,
	smallWindowFront19,
	smallWindowFront20,
	smallWindowFront21,
	smallWindowSide1,
	smallWindowSide2,
	smallWindowSide3,
	smallWindowSide4,
	smallWindowSide5,
	smallWindowSide6,
	smallWindowSide7,
	walkway1,
	walkway2,
	walkway3,
	walkway4,
	walkway5,
	walkway6,
	walkway7,
	walkway8,
	walkway9,
	walkwayRailing1,
	walkwayRailing2,
	walkwayRailing3,
	walkwayRailing4,
	walkwayRailing5,
	walkwayRailing6,
	walkwayRailing7,
	walkwayRailing8,
	walkwayRailing9,
)

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

	rotateSign(delta);

	if(noClip){
		controls.update();
	}

	renderer.render(scene, camera);	
}

var degSign = 0;
var step = +1;

function rotateSign(x){
	if(loadingSign){
		if(degSign >= 150){
			step = -1;
		}
		if(degSign <= 1){
			step = +1;
		}
		
		sign.children[4].rotation.z -= .5*(Math.PI/180) * step;
	
		degSign += step;
		console.log('test '+degSign);
	}
};

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
