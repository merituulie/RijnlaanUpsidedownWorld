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

function repeatTextures(texture, repX, repY) {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.offset.set(0,0);
	texture.repeat.set(repX,repY);

	return texture;
}

//cube
var geometry = new THREE.BoxGeometry(2,2,2);
//var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function plane(x,y,z, image,repX,repY){
	var planeGeometry = new THREE.BoxGeometry(x,y,z);
	var texture = new THREE.TextureLoader().load(imagePrefix+image+'.jpg', function(texture){
	texture = repeatTextures(texture, repX, repY);
	});
	var material = new THREE.MeshLambertMaterial({map: texture});
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

var body = new THREE.BoxGeometry()

// Trees
var trees = new THREE.Group();

var treeGeometries = new THREE.Tree({
	generations: 4,        // # for branch' hierarchy
	length: 15.0,      // length of root branch
	uvLength: 8.0,     // uv.v ratio against geometry length (recommended is generations * length)
	radius: 0.8,      // radius of root branch
	radiusSegments: 8,     // # of radius segments for each branch geometry
	heightSegments: 8      // # of height segments for each branch geometry
});

var treeGeometry = THREE.TreeGeometry.build(treeGeometries);
var tree = new THREE.Mesh(treeGeometry, new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'treePattern.png') }));
tree.position.set(-45, -6, 0);

var tree1 = tree.clone();
tree1.rotation.y = 0.5;
tree1.position.set(-45, -6, tree.position.z - 70);

var tree2 = tree.clone();
tree2.rotation.y = 0.75;
tree2.position.set(-45, -6, tree1.position.z - 70);

var tree3 = tree.clone();
tree3.rotation.y = 0.2;
tree3.position.set(-45, -6, tree2.position.z - 70);

var tree4 = tree.clone();
tree4.rotation.y = 0.45;
tree4.position.set(-45, -6, tree3.position.z - 70);

var tree5 = tree.clone();
tree5.rotation.y = 0.75;
tree5.position.set(-45, -6, tree4.position.z - 70);

var tree6 = tree.clone();
tree6.rotation.y = 0.20;
tree6.position.set(-45, -6, tree5.position.z - 70);

var tree7 = tree.clone();
tree7.rotation.y = 0.15;
tree7.position.set(-45, -6, tree6.position.z - 70);

var tree8 = tree.clone();
tree8.rotation.y = 0.70;
tree8.position.set(-45, -6, tree7.position.z - 70);

var tree9 = tree.clone();
tree9.rotation.y = 0.35;
tree9.position.set(-45, -6, tree8.position.z - 70);

var tree10 = tree.clone();
tree10.rotation.y = 0.80;
tree10.position.set(-45, -6, tree10.position.z - 70);

var tree11 = tree.clone();
tree11.rotation.y = 0.15;
tree11.position.set(-45, -6, tree10.position.z - 70);

var tree12 = tree.clone();
tree12.rotation.y = 0.60;
tree12.position.set(-45, -6, tree11.position.z - 70);

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
	tree12
	);
trees.position.set(0, 0, 310);
scene.add(trees);

var tree13 = tree.clone();
tree13.position.set(-175, -10, 15);
scene.add(tree13);

// Bushes
var bushGeometry = new THREE.BoxGeometry( 130, 20, 5);

var bushMaterials = [
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture) {
		texture = repeatTextures(texture, 1, 1);
	}), side: THREE.DoubleSide}), // RIGHT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'dryGrass.png', function(texture){
		texture = repeatTextures(texture, 1, 1);
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

var tallBush1 = tallBush.clone();
tallBush1.rotation.y += 90*(Math.PI/180);
tallBush1.position.x = -195;
tallBush1.position.z = -35;

var tallBush2 = tallBush.clone();
tallBush2.position.z = -100;

var bushGeometry1 = new THREE.BoxGeometry(30, 20, 5);
var tallBush3 = new THREE.Mesh( bushGeometry1, bushMaterial);
tallBush3.rotation.y += 90*(Math.PI/180);
tallBush3.position.set(-68, 0, 11);

tallBush4 = tallBush3.clone();
tallBush4.position.set(-67.5, 0, -85);

tallBush5 = tallBush2.clone();
tallBush5.position.z = -230;

tallBush6 = tallBush1.clone();
tallBush6.position.z = -163;

// All tall bushes
var tallBushes = new THREE.Group();
tallBushes.add(
	tallBush,
	tallBush1,
	tallBush2,
	tallBush3,
	tallBush4,
	tallBush5,
	tallBush6
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
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(imagePrefix + 'damagedRoof.jpg', function(texture){
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
cubeHouseBase.position.set(150, 0.75, -130);

var cubeHouse = new THREE.Group();

// Cube housse windows
var cubeHouseWindow = plane(17, 0.25, 16,'brokenGlassWithFrame',1,1);
cubeHouseWindow.rotation.x += 90*(Math.PI/180);
cubeHouseWindow.position.set(146, 6, -90);


// Cube house door
var cubeHouseDoor = plane(7, 0.25, 19,'door',1,1);
cubeHouseDoor.rotation.x += 90*(Math.PI/180);
cubeHouseDoor.position.set(160, 0.75, -90);

cubeHouse.add(
	cubeHouseBase,
	cubeHouseWindow,
	cubeHouseDoor
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
roofHouse.position.set(-110, 0, -15);

// All roof houses
var roofHouses = new THREE.Group();

var roofHouse1 = roofHouse.clone();
roofHouse1.position.z = roofHouse.position.z - 45;
var roofHouse2 = roofHouse1.clone();
roofHouse2.position.z = roofHouse1.position.z - 85;
var roofHouse3 = roofHouse2.clone();
roofHouse3.position.z = roofHouse2.position.z - 45;

var roofHouse4 = roofHouse.clone();
roofHouse4.position.z = 65;
roofHouse4.rotation.y += -90*(Math.PI/180);
var roofHouse5 = roofHouse4.clone();
roofHouse5.position.x = roofHouse4.position.x - 45;
var roofHouse6 = roofHouse5.clone();
roofHouse6.rotation.y += 180*(Math.PI/180);
roofHouse6.position.z = roofHouse6.position.z + 75;
var roofHouse7 = roofHouse6.clone();
roofHouse7.position.x = roofHouse6.position.x + 45;

var roofHouse8 = roofHouse1.clone();
roofHouse8.position.z = 200;
var roofHouse9 = roofHouse8.clone();
roofHouse9.position.z = roofHouse8.position.z + 45;
var roofHouse10 = roofHouse9.clone();
roofHouse10.position.z = roofHouse9.position.z + 85;

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
	roofHouse10
);

scene.add(roofHouses);

//ambientlight
var light = new THREE.AmbientLight(0x6e0f02,0.5);
scene.add(light);

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
