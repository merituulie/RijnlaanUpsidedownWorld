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

var speedTrans = 200;
var speedRot = THREE.Math.degToRad(90);

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

function repeatTextures(texture, repX, repY) {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.offset.set(0,0);
	texture.repeat.set(repX,repY);

	return texture;
}

function plane(x,y,z, image,repX,repY){
	var planeGeometry = new THREE.BoxGeometry(x,y,z);
	if (image != '') {
		var texture = new THREE.TextureLoader().load(imagePrefix+image+'.jpg', function(texture){
		texture = repeatTextures(texture, repX, repY);
		});
		var material = new THREE.MeshLambertMaterial({map: texture});
	} else 
	{
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
);

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
);

//Big apartmentbuilding
var rijnlaanDorm = new THREE.Group();
scene.add(rijnlaanDorm);
rijnlaanDorm.rotation.y -= 12*(Math.PI/180);
rijnlaanDorm.scale.set(.6,1,1);
rijnlaanDorm.position.set(150,-1,240);

var mainBuildingTop = plane(150,40,250,'weatheredBrick',8,3);
mainBuildingTop.position.set(0,35,0);

var mainBuildingBottom = plane(148,20,250,'greyBrick',8,2);
mainBuildingBottom.position.set(1,5,0);

var sideBlockTop = plane(65,36,30,'damagedWood',2,2);
sideBlockTop.position.set(25,33,-140);

var sideBlockBottom = plane(65,20,30,'greyBrick',2,2);
sideBlockBottom.position.set(25,5,-140);

// Roof
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
);

var body = new THREE.BoxGeometry()

// Trees
var trees = new THREE.Group();

var treeGeometries = new THREE.Tree({
	generations: 5,        // # for branch' hierarchy
	length: 28.0,      // length of root branch
	uvLength: 10.0,     // uv.v ratio against geometry length (recommended is generations * length)
	radius: 1.5,      // radius of root branch
	radiusSegments: 8,     // # of radius segments for each branch geometry
	heightSegments: 8      // # of height segments for each branch geometry
});

var treeGeometry = THREE.TreeGeometry.build(treeGeometries);
var tree = new THREE.Mesh(treeGeometry, new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'treePattern.png', function(texture) {
	texture = repeatTextures(texture, 1, 3); 
	})
 }) );
tree.position.set(-45, -6, 0);

var tree1 = tree.clone();
tree1.position.set(-45, -6, tree.position.z - 70);
var tree2 = tree.clone();
tree2.position.set(-45, -6, tree1.position.z - 70);
var tree3 = tree.clone();
tree3.position.set(-45, -6, tree2.position.z - 70);
var tree4 = tree.clone();
tree4.position.set(-45, -6, tree3.position.z - 70);
var tree5 = tree.clone();
tree5.position.set(-45, -6, tree4.position.z - 70);
var tree6 = tree.clone();
tree6.position.set(-45, -6, tree5.position.z - 70);
var tree7 = tree.clone();
tree7.position.set(-45, -6, tree6.position.z - 70);
var tree8 = tree.clone();
tree8.position.set(-45, -6, tree7.position.z - 70);
var tree9 = tree.clone();
tree9.position.set(-45, -6, tree8.position.z - 70);
var tree10 = tree.clone();
tree10.position.set(-45, -6, tree9.position.z - 70);
var tree11 = tree.clone();
tree11.position.set(-45, -6, tree10.position.z - 70);
var tree12 = tree.clone();
tree12.position.set(-45, -6, tree11.position.z - 70);
var tree13 = tree.clone();
tree13.position.set(-45, -6, tree12.position.z - 70);
var tree14 = tree.clone();
tree14.position.set(-45, -6, tree13.position.z - 70);
var tree15 = tree.clone();
tree15.position.set(45, -6, 0);
var tree16 = tree.clone();
tree16.position.set(45, -6, tree15.position.z - 70);
var tree17 = tree.clone();
tree17.position.set(45, -6, tree16.position.z - 300);
var tree18 = tree.clone();
tree18.position.set(45, -6, tree17.position.z - 70);
var tree19 = tree.clone();
tree19.position.set(45, -6, tree18.position.z - 70);
var tree20 = tree.clone();
tree20.scale.set(0.5, 0.5, 0.5);
tree20.position.set(120, -6, -460);
var tree21 = tree20.clone();
tree21.position.set(110, -6, -455);

trees.add(
	tree,
	tree1,
	tree2,
	tree3,
	tree4,
	tree5,
	tree6,
	tree7,
	tree8,
	tree9,
	tree10,
	tree11,
	tree12,
	tree13,
	tree14,
	tree15,
	tree16,
	tree17,
	tree18,
	tree19,
	tree20,
	tree21
	);
trees.position.set(0, 0, 310);
scene.add(trees);

var tree13 = tree.clone();
tree13.position.set(-175, -10, 15);
scene.add(tree13);

// Bushes
var bushGeometry = new THREE.BoxGeometry( 130, 40, 5);

var bushMaterials = [
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture) {
		texture = repeatTextures(texture, 1, 3);
	}), side: THREE.DoubleSide}), // RIGHT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 1, 3);
	}), side: THREE.DoubleSide }), // LEFT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 5, 1);
	}),  side: THREE.DoubleSide }), // TOP SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 1, 1);
	}),  side: THREE.DoubleSide }),// BOTTOM SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 5, 1);
	}),  side: THREE.DoubleSide }), // FRONT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 5, 1);
	}),  side: THREE.DoubleSide }) // BACK SIDE
];
var bushMaterial = new THREE.MeshFaceMaterial( bushMaterials );
var tallBush = new THREE.Mesh( bushGeometry, bushMaterial);
tallBush.position.set(-130, 0, 28);

var tallBush7 = tallBush.clone();
tallBush7.position.z = tallBush.position.z + 75;

var tallBush1 = tallBush.clone();
tallBush1.rotation.y += 90*(Math.PI/180);
tallBush1.position.x = -195;
tallBush1.position.z = -35;

var tallBush8 = tallBush1.clone();
tallBush8.position.x = -67;
tallBush8.position.z = 95;

var tallBush2 = tallBush.clone();
tallBush2.position.z = -100;

tallBush5 = tallBush2.clone();
tallBush5.position.z = -230;
tallBush5.y = 17;

tallBush6 = tallBush1.clone();
tallBush6.position.z = -163;

// Shorter bushes on the left
var bushGeometry1 = new THREE.BoxGeometry(40, 17, 5);
var shortBush = new THREE.Mesh( bushGeometry1, bushMaterial);
shortBush.rotation.y += 90*(Math.PI/180);
shortBush.position.set(-67, 0, -208);

// Shorter bushes on the back right
var bushGeometry2 = new THREE.BoxGeometry(50, 15, 5);
var shortBush1 = new THREE.Mesh( bushGeometry2, bushMaterial);
shortBush1.rotation.y = shortBush.rotation.y;
shortBush1.position.set(45, 0, 66);
var shortBush2 = shortBush1.clone();
shortBush2.position.z = shortBush1.position.z + 50;
var shortBush3 = shortBush1.clone();
shortBush3.position.z = shortBush2.position.z + 50;
var shortBush2 = shortBush1.clone();
shortBush2.position.z = shortBush1.position.z + 50;
var shortBush4 = shortBush1.clone();
shortBush4.rotation.y += 90*(Math.PI/180);
shortBush4.position.z = shortBush1.position.z - 23;
shortBush4.position.x = shortBush1.position.x + 22;
var shortBush19 = shortBush4.clone();
shortBush19.position.x = shortBush4.position.x + 50;

// Shorter bushes on the right
var shortBush5 = shortBush4.clone();
shortBush5.position.z = shortBush4.position.z - 102;
shortBush5.position.x = shortBush4.position.x + 43;
var shortBush6 = shortBush5.clone();
shortBush6.rotation.y += 90*(Math.PI/180);
shortBush6.position.z = shortBush5.position.z - 22;
shortBush6.position.x = shortBush5.position.x - 22;
var shortBush7 = shortBush6.clone();
shortBush7.position.z = shortBush7.position.z - 50;
var shortBush8 = shortBush5.clone();
shortBush8.position.z = shortBush5.position.z - 98;
shortBush8.position.x = shortBush5.position.x + 1;
var shortBush9 = shortBush8.clone();
shortBush9.position.x = shortBush8.position.x + 80;
var shortBush10 = shortBush9.clone();
shortBush10.position.x = shortBush9.position.x + 80;
var shortBush11 = shortBush6.clone();
shortBush11.position.x = shortBush6.position.x + 100;
var shortBush12 = shortBush11.clone();
shortBush12.position.z = shortBush11.position.z - 50;
var shortBush13 = shortBush6.clone();
shortBush13.position.x = shortBush6.position.x + 180;
var shortBush14 = shortBush13.clone();
shortBush14.position.z = shortBush13.position.z - 50;
var shortBush15 = shortBush5.clone();
shortBush15.position.x = shortBush5.position.x + 80;
var shortBush16 = shortBush15.clone();
shortBush16.position.x = shortBush15.position.x + 80;
var shortBush17 = shortBush13.clone();
shortBush17.position.x = shortBush13.position.x + 65;
var shortBush18 = shortBush17.clone();
shortBush18.position.z = shortBush17.position.z - 50;

// All tall bushes
var tallBushes = new THREE.Group();
tallBushes.add(
	tallBush,
	tallBush1,
	tallBush2,
	tallBush5,
	tallBush6,
	tallBush7,
	tallBush8,
	shortBush,
	shortBush1,
	shortBush2,
	shortBush3,
	shortBush4,
	shortBush5,
	shortBush6,
	shortBush7,
	shortBush8,
	shortBush9,
	shortBush10,
	shortBush11,
	shortBush12,
	shortBush13,
	shortBush14,
	shortBush15,
	shortBush16,
	shortBush17,
	shortBush18,
	shortBush19
);
scene.add(tallBushes);
	
//Cubehouses
var cubeHouseGeometry = new THREE.BoxGeometry(35, 35, 80);
	
var cubeHouseMaterials = [
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture) {
			texture = repeatTextures(texture, 3, 1);
		}), side: THREE.DoubleSide}), // RIGHT SIDE
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture){
			texture = repeatTextures(texture, 3, 1);
		}), side: THREE.DoubleSide }), // LEFT SIDE
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture){
			texture = repeatTextures(texture, 1, 1);
		}),  side: THREE.DoubleSide }), // TOP SIDE
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture){
			texture = repeatTextures(texture, 3, 1);
		}),  side: THREE.DoubleSide }),// BOTTOM SIDE
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture){
			texture = repeatTextures(texture, 1, 1);
		}),  side: THREE.DoubleSide }), // FRONT SIDE
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedTile.png', function(texture){
			texture = repeatTextures(texture, 1, 1);
		}),  side: THREE.DoubleSide }) // BACK SIDE
	];
var cubeHouseBaseMaterial = new THREE.MeshFaceMaterial(cubeHouseMaterials);
var cubeHouseBase = new THREE.Mesh(cubeHouseGeometry, cubeHouseBaseMaterial);
cubeHouseBase.position.set(150, 0.75, -120);

var cubeHouse = new THREE.Group();

// Cube house windows
var cubeHouseWindow = plane(17, 0.25, 16,'brokenGlassWithFrame',1,1);
cubeHouseWindow.rotation.x += 90*(Math.PI/180);
cubeHouseWindow.position.set(146, 6, -80);

var cubeHouseWindowSide1 = cubeHouseWindow.clone();
cubeHouseWindowSide1.rotation.z -= 90*(Math.PI/180);
cubeHouseWindowSide1.position.set(132, 6, -92);

var cubeHouseWindowSide2 = cubeHouseWindowSide1.clone();
cubeHouseWindowSide2.position.y = -95;

// Cube house door
var cubeHouseDoor = plane(7, 0.25, 19,'door',1,1);
cubeHouseDoor.rotation.x += 90*(Math.PI/180);
cubeHouseDoor.position.set(160, 0.75, -80);

// Cube house
var cubeHouseRoof = plane(82, 0.75, 37,'damagedRoof',1,1);
cubeHouseRoof.rotation.y += 90*(Math.PI/180);
cubeHouseRoof.position.set(149, 18.5, -120);

cubeHouse.add(
	cubeHouseBase,
	cubeHouseWindow,
	cubeHouseWindowSide1,
	cubeHouseWindowSide2,
	cubeHouseDoor,
	cubeHouseRoof
);
	
var cubeHouse1 = cubeHouse.clone();
cubeHouse1.position.x = cubeHouse.position.x + 80;
	
var cubeHouse2 = cubeHouse1.clone();
cubeHouse2.position.x = cubeHouse1.position.x + 80;

// Cubehouse group
var cubeHouses = new THREE.Group();
	cubeHouses.add(
		cubeHouse,
		cubeHouse1,
		cubeHouse2
	);
scene.add(cubeHouses);

// Roof houses
var roofMaterial = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg'), side: THREE.DoubleSide});

// Roof
var roofGeometry = new THREE.Geometry();
var v1 = new THREE.Vector3(0,15,0);
var v2 = new THREE.Vector3(0,0,-15);
var v3 = new THREE.Vector3(0,0,15);
roofGeometry.vertices.push(v1);
roofGeometry.vertices.push(v2);
roofGeometry.vertices.push(v3);
roofGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );


roofGeometry.faceVertexUvs[0].push([
        new THREE.Vector2(0,0),
        new THREE.Vector2(0.5,0),
		new THREE.Vector2(0.5,0.5)
		]);

var roofTriangleFront = new THREE.Mesh( roofGeometry, roofMaterial);
roofTriangleFront.rotation.y += 90*(Math.PI/180);
roofTriangleFront.position.set(0, 20, 25);

var roofTriangleBack = roofTriangleFront.clone();
roofTriangleBack.position.set(0, 20, -25);

var roofTopLeft = plane(22,1,50,'roofHouseRoof',1,1);
roofTopLeft.rotation.z += 45*(Math.PI/180);
roofTopLeft.position.set(-7.5, 27, 0);

var roofTopRight = plane(22,1,50,'roofHouseRoof',1,1);
roofTopRight.rotation.z += -45*(Math.PI/180);
roofTopRight.position.set(7.5, 27, 0);

// Base
var roofHouseGeometry = new THREE.BoxGeometry(30, 40, 50);

var roofHouseMaterials = [
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg', function(texture) {
		texture = repeatTextures(texture, 3, 1);
	}), side: THREE.DoubleSide}), // RIGHT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg', function(texture){
		texture = repeatTextures(texture, 3, 1);
	}), side: THREE.DoubleSide }), // LEFT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedRoof.jpg', function(texture){
		texture = repeatTextures(texture, 1, 1);
	}),  side: THREE.DoubleSide }), // TOP SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg', function(texture){
		texture = repeatTextures(texture, 3, 1);
	}),  side: THREE.DoubleSide }),// BOTTOM SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg', function(texture){
		texture = repeatTextures(texture, 1, 1);
	}),  side: THREE.DoubleSide }), // FRONT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedWood.jpg', function(texture){
		texture = repeatTextures(texture, 1, 1);
	}),  side: THREE.DoubleSide }) // BACK SIDE
];
var roofHouseBaseMaterial = new THREE.MeshFaceMaterial(roofHouseMaterials);
var roofHouseBase = new THREE.Mesh(roofHouseGeometry, roofHouseBaseMaterial);

// Upstairs windows
var upstairCubeGeometry = new THREE.BoxGeometry(30, 8, 16);
var upstairCube = new THREE.Mesh(upstairCubeGeometry, roofHouseBaseMaterial);
upstairCube.position.set(0, 23, 15);

var upstairCube1 = upstairCube.clone();
upstairCube1.position.set(0, 23, -15);

var roofHouseWindow = plane(5.5, 0.25, 4.5,'brokenGlassWithFrame',1,1);
roofHouseWindow.rotation.z += 90*(Math.PI/180);
roofHouseWindow.rotation.x += 90*(Math.PI/180);
roofHouseWindow.position.set( -15, 23.5, 11);

var roofHouseWindow1 = roofHouseWindow.clone();
roofHouseWindow.position.set( -15, 23.5, 19);
var roofHouseWindow2 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow2.position.set( -15, 23.5, -11);
var roofHouseWindow3 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow3.position.set( -15, 23.5, -19);
var roofHouseWindow4 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow4.position.set( 15, 23.5, -11);
var roofHouseWindow5 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow5.position.set( 15, 23.5, -19);
var roofHouseWindow6 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow6.position.set( 15, 23.5, 11);
var roofHouseWindow7 = roofHouseWindow.clone( -15, 23.5, -11);
roofHouseWindow7.position.set( 15, 23.5, 19);

// Downstairs windows
var roofHouseDownWindow = plane(11, 0.25, 15,'brokenGlassWithFrame',1,1);
roofHouseDownWindow.rotation.z += 90*(Math.PI/180);
roofHouseDownWindow.rotation.x += 90*(Math.PI/180);
roofHouseDownWindow.position.set( -15, 6, 0);

var roofHouseDownWindow1 = roofHouseDownWindow.clone();
roofHouseDownWindow1.position.set( -15, 6, 16);
var roofHouseDownWindow2 = roofHouseDownWindow.clone();
roofHouseDownWindow2.position.set( -15, 6, -16);
var roofHouseDownWindow3 = roofHouseDownWindow.clone();
roofHouseDownWindow3.position.set( 0, 6, 25);
roofHouseDownWindow3.rotation.z = 0;
var roofHouseDownWindow4 = roofHouseDownWindow.clone();
roofHouseDownWindow4.position.set( 15, 6, -16);
var roofHouseDownWindow5 = roofHouseDownWindow.clone();
roofHouseDownWindow5.position.set( 15, 6, 16);

// Roof house garden
var roofHouseGarden = plane(12, 2.5, 17,'damagedRoof',1,1);
roofHouseGarden.position.set(-95, -4, 0);
var roofHouseGarden1 = roofHouseGarden.clone();
roofHouseGarden1.position.z = -30;
var roofHouseGarden2 = roofHouseGarden1.clone();
roofHouseGarden2.position.z = roofHouseGarden1.position.z - 15;
var roofHouseGarden3 = roofHouseGarden2.clone();
roofHouseGarden3.position.z = roofHouseGarden2.position.z -29;

var roofHouseGardens = new THREE.Group();

roofHouseGardens.add(
	roofHouseGarden,
	roofHouseGarden1,
	roofHouseGarden2,
	roofHouseGarden3
);
scene.add(roofHouseGardens);

// Door
var roofHouseDoor = plane(7, 0.25, 19,'door',1,1);
roofHouseDoor.rotation.z += 90*(Math.PI/180);
roofHouseDoor.rotation.x += 90*(Math.PI/180);
roofHouseDoor.position.set(15, 0, 0);

var roofHouse = new THREE.Group();

// House
roofHouse.add(
	roofHouseBase,
	roofTopLeft,
	roofTopRight,
	roofTriangleFront,
	roofTriangleBack,
	upstairCube,
	upstairCube1,
	roofHouseWindow,
	roofHouseWindow1,
	roofHouseWindow2,
	roofHouseWindow3,
	roofHouseWindow4,
	roofHouseWindow5,
	roofHouseWindow6,
	roofHouseWindow7,
	roofHouseDownWindow,
	roofHouseDownWindow1,
	roofHouseDownWindow2,
	roofHouseDownWindow3,
	roofHouseDownWindow4,
	roofHouseDownWindow5,
	roofHouseDoor
);
roofHouse.position.set(-120, 0, -15);

// All roof houses
var roofHouses = new THREE.Group();

var roofHouse1 = roofHouse.clone();
roofHouse1.position.z = roofHouse.position.z - 45;
var roofHouse2 = roofHouse1.clone();
roofHouse2.position.z = roofHouse1.position.z - 85;
roofHouse2.rotation.y += -90*(Math.PI/180);
var roofHouse11 = roofHouse.clone();
roofHouse11.position.x = roofHouse1.position.x - 120;
var roofHouse12 = roofHouse11.clone();
roofHouse12.position.z = roofHouse12.position.z - 45;

var roofHouse3 = roofHouse2.clone();
roofHouse3.position.z = roofHouse2.position.z - 45;

var roofHouse4 = roofHouse.clone();
roofHouse4.position.z = 65;
roofHouse4.rotation.y += -90*(Math.PI/180);
var roofHouse5 = roofHouse4.clone();
roofHouse5.position.x = roofHouse4.position.x - 45;
var roofHouse18 = roofHouse4.clone();
roofHouse18.position.z = roofHouse4.position.z - 75;
roofHouse18.rotation.y -= 90*(Math.PI/180);

var roofHouse13 = roofHouse4.clone();
roofHouse13.position.x = roofHouse5.position.x - 65;
var roofHouse6 = roofHouse5.clone();
roofHouse6.rotation.y += 180*(Math.PI/180);
roofHouse6.position.z = roofHouse6.position.z + 75;
var roofHouse7 = roofHouse6.clone();
roofHouse7.position.x = roofHouse6.position.x + 45;
var roofHouse14 = roofHouse7.clone();
roofHouse14.position.x = roofHouse7.position.x - 110;

var roofHouse8 = roofHouse1.clone();
roofHouse8.position.z = 200;
var roofHouse9 = roofHouse8.clone();
roofHouse9.position.z = roofHouse8.position.z + 45;
var roofHouse16 = roofHouse8.clone();
roofHouse16.position.x = roofHouse8.position.x - 65;

var roofHouse10 = roofHouse9.clone();
roofHouse10.rotation.y -= 90*(Math.PI/180);
roofHouse10.position.z = roofHouse9.position.z + 85;
var roofHouse15 = roofHouse10.clone();
roofHouse15.position.x = roofHouse10.position.x - 45;


roofHouses.add(
	roofHouse,
	roofHouse1,
	roofHouse2,
	roofHouse3,
	roofHouse4,
	roofHouse5,
	roofHouse6,
	roofHouse7,
	roofHouse8,
	roofHouse9,
	roofHouse10,
	roofHouse11,
	roofHouse12,
	roofHouse13,
	roofHouse14,
	roofHouse15,
	roofHouse16
);
scene.add(roofHouses);

var bigHouse = roofHouse.clone();
bigHouse.scale.set(2, 2, 2);
bigHouse.position.set(-250, 0, -320);
scene.add(bigHouse);

var bigHouse1 = bigHouse.clone();
bigHouse1.position.z = -450;
scene.add(bigHouse1);

//ambientlight
var light = new THREE.AmbientLight(0x8a6060, .5);
scene.add(light);

//rotating pointlight
var pointLight = new THREE.PointLight( 0xFD3D14, 4, 50);
var pointLight1 = pointLight.clone();
pointLight1.position.z = pointLight.position.z - 20;
var pointLight2 = pointLight1.clone();
pointLight2.position.z = pointLight1.position.z - 40;
var pointLight3 = pointLight2.clone();
pointLight3.position.z = pointLight2.position.x - 100;
var pointLight4 = pointLight3.clone();
pointLight4.position.z = pointLight3.position.z + 150;
pointLight4.position.x = pointLight3.position.x - 90;
var pointLight5 = pointLight3.clone();
pointLight5.position.set(pointLight4.position.x + 100, pointLight4.position.y, pointLight4.position.z + 200);
var pointLight6 = pointLight.clone();
pointLight6.position.set(50, 15, 50);

var pointLights = new THREE.Group();

pointLights.add(
	pointLight,
	pointLight1,
	pointLight2,
	pointLight3,
	pointLight4,
	pointLight5,
	pointLight6
);
scene.add(pointLights);

var render = function(){
	requestAnimationFrame(render);
	delta = clock.getDelta();
	
	rotateSign();

	var time = Date.now() * 0.0005;
	pointLights.position.x = Math.sin( time * 0.7) * 30;
	pointLights.position.y = Math.cos( time * 0.5) * 40;
	pointLights.position.z = Math.cos( time * 0.3) * 30;

	if(noClip){
		controls.update();
	}

	renderer.render(scene, camera);	
}

var degSign = 0;
var step = +1;

function rotateSign(){
	if(loadingSign){
		if(degSign >= 150){
			step = -1;
		}
		if(degSign <= 1){
			step = +1;
		}
		
		sign.children[4].rotation.z -= .5*(Math.PI/180) * step;
	
		degSign += step;
	}
};
//controls
controls = new THREE.OrbitControls(camera); 
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.noKeys = true;

// Importing cars
var loader = new THREE.ObjectLoader();

var car = loader.load( 'Models/volkswagen.json', function ( car ) {
	car.scale.set(0.03, 0.03, 0.03);
	car.rotation.y += 45*(Math.PI/180);
	car.position.set(170, 4, -445);
	
	var car1 = car.clone();
	car1.position.set(-10, 4.2, -305);
	car1.rotation.set(5*(Math.PI/180), 25*(Math.PI/180), -8*(Math.PI/180));

	var car2 = car.clone();
	car2.position.set(180, 4.8, 23);
	car2.rotation.set(-6*(Math.PI/180), 40*(Math.PI/180), 3*(Math.PI/180));

	var cars = new THREE.Group();
	cars.add(
		car,
		car1,
		car2
	);

	scene.add(cars);
});

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
