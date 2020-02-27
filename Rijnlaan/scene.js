// download threejs.org
// open /Applications/Google\ Chrome.app --args --allow-file-access-from-files

// Create scene
var scene = new THREE.Scene();

// Create camera
var camera = new THREE.PerspectiveCamera(
	75, // fov — Camera frustum vertical field of view.
	window.innerWidth/window.innerHeight, // aspect — Camera frustum aspect ratio.
	0.1, // near — Camera frustum near plane.
	1000); // far — Camera frustum far plane. 

// moving camera further away
camera.position.z = 4;

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);






// viewport rezising, resize the window
window.addEventListener( 'resize', function(  ) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
} );





// general light
var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );
scene.add( ambientLight );

// moving pointLighter
var pointLighter = new THREE.PointLight( 0xFD3D14, 4, 50);
scene.add( pointLighter );

pointLighter.position.z = 4;
pointLighter.position.x = -4;

// rotating the camera, zooming in and out, etc. include in the html orbitcontorls!
controls = new THREE.OrbitControls( camera, renderer.domElement );




// create the shape (1,1,1) -> width, depth, heigth
var cubeHouseGeometry = new THREE.BoxGeometry( 1, 1, 2);

// create a material, colour or image texture
// REMEMBER WITH LAMBERT ETC MATERIALS YOU NEED A LIGHT

//use texture for each side
var cubeHouseMaterials = [ //-> doubleside => frontside or backside
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // RIGHT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // LEFT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // TOP SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // BOTTOM SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // FRONT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ) // BACK SIDE
];
var cubeHouseBaseMaterial = new THREE.MeshFaceMaterial( cubeHouseMaterials );
var cubeHouseBase = new THREE.Mesh(cubeHouseGeometry, cubeHouseBaseMaterial);

var cubeHouseRoofGeometry = new THREE.Geometry();

cubeHouseRoofGeometry.vertices = [
	new THREE.Vector3(-0.15, -0.65, 0), // Rigth, Left, Bottom, Front, Back
	new THREE.Vector3(-0.15, 1.65, 0), // Left Back corner
	new THREE.Vector3(1.15, 1.65, 0), // Rigth Back
	new THREE.Vector3(1.15, -0.65, 0),
	new THREE.Vector3(0.5, 0.5, 0.5)
];

cubeHouseRoofGeometry.faces = [
	new THREE.Face3(0, 1, 2),
	new THREE.Face3(0, 2, 3),
	new THREE.Face3(1, 0, 4),
	new THREE.Face3(2, 1, 4),
	new THREE.Face3(3, 2, 4),
	new THREE.Face3(0, 3, 4)
];

var cubeHouseRoofMaterials = [ //-> doubleside => frontside or backside
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }), // RIGHT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }), // LEFT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }), // TOP SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }), // BOTTOM SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }), // FRONT SIDE
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('Images/damagedRoofTexture.jpg'), side: THREE.DoubleSide }) // BACK SIDE
];

var cubeHouseRoofMaterial = new THREE.MeshFaceMaterial(cubeHouseRoofMaterials);
var cubeHouseRoofMesh = new THREE.Mesh(cubeHouseRoofGeometry, cubeHouseRoofMaterial);
cubeHouseRoofMesh.rotation.x = -90 * (Math.PI / 180);
cubeHouseRoofMesh.position.set(-1.5, 0.25, 0.5);

var cubeHouse = new THREE.Group();
scene.add(cubeHouse);

cubeHouse.add(
	cubeHouseBase,
	cubeHouseRoofMesh);

cubeHouseBase.position.x = -1;
cubeHouseBase.position.y = -0.25;





// creating the bush
var bushGeometry = new THREE.BoxGeometry( 2.5, 1.5, 1);

var bushMaterials = [ //-> doubleside => frontside or backside
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ), // RIGHT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ), // LEFT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ), // TOP SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ), // BOTTOM SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ), // FRONT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/dryGrass.png' ), side: THREE.DoubleSide } ) // BACK SIDE
];
var bushMaterial = new THREE.MeshFaceMaterial( bushMaterials );
var bush = new THREE.Mesh( bushGeometry, bushMaterial);
scene.add(bush);

bush.position.x = 1;




// Create leafless trees
var treeGeometries = new THREE.Tree({
    generations : 4,        // # for branch' hierarchy
    length      : 2.0,      // length of root branch
    uvLength    : 8.0,     // uv.v ratio against geometry length (recommended is generations * length)
    radius      : 0.2,      // radius of root branch
    radiusSegments : 8,     // # of radius segments for each branch geometry
    heightSegments : 8      // # of height segments for each branch geometry
});

var treeGeometry = THREE.TreeGeometry.build(treeGeometries);

var tree = new THREE.Mesh( treeGeometry, new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/darkTreePattern.jpg' ) } ) );

scene.add(tree);

tree.position.x = -2;
tree.position.y = -1;





// game logic

var update = function ( ) {

	var time = Date.now() * 0.0005;

	// rotate lighting
	pointLighter.position.x = Math.sin( time * 0.7) * 30;
	pointLighter.position.y = Math.cos( time * 0.5) * 40;
	pointLighter.position.z = Math.cos( time * 0.3) * 30;
};

// draw scene
var render = function( ) {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

// run game loop (update, render, repeat)
var GameLoop = function ( ) {
	requestAnimationFrame( GameLoop );

	update( );
	render( );
};

GameLoop();

// https://www.youtube.com/watch?v=YKzyhcyAijo setting the own server
