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
/* var pointLighter = new THREE.PointLight( 0xFD3D14, 4, 50);
scene.add( pointLighter );

pointLighter.position.z = 4;
pointLighter.position.x = -4; */

// rotating the camera, zooming in and out, etc. include in the html orbitcontorls!
controls = new THREE.OrbitControls( camera, renderer.domElement );

// create the shape (1,1,1) -> width, depth, heigth
var geometry = new THREE.BoxGeometry( 1, 1, 1 );

// create a material, colour or image texture
// REMEMBER WITH LAMBERT ETC MATERIALS YOU NEED A LIGHT

//use texture for each side
var damagedCubeMaterials = [ //-> doubleside => frontside or backside
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // RIGHT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // LEFT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // TOP SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // BOTTOM SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // FRONT SIDE
	new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ) // BACK SIDE
];
var material = new THREE.MeshFaceMaterial( damagedCubeMaterials );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

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
scene.add( bush );

cube.position.x = -1;
cube.position.y = -0.25;

bush.position.x = 1;

// Create leafless trees
var treeGeometries = new THREE.Tree({
    generations : 4,        // # for branch' hierarchy
    length      : 4.0,      // length of root branch
    uvLength    : 16.0,     // uv.v ratio against geometry length (recommended is generations * length)
    radius      : 0.2,      // radius of root branch
    radiusSegments : 8,     // # of radius segments for each branch geometry
    heightSegments : 8      // # of height segments for each branch geometry
});

var treeGeometry = THREE.TreeGeometry.build(treeGeometries);

var tree = new THREE.Mesh( treeGeometry, new THREE.MeshLambertMaterial({ color: 0x100F09 }) );

scene.add(tree);

tree.position.x = -2;
tree.position.y = -1;

// game logic

var update = function ( ) {

	/*var time = Date.now() * 0.0005;

	// rotate lighting
	pointLighter.position.x = Math.sin( time * 0.7) * 30;
	pointLighter.position.y = Math.cos( time * 0.5) * 40;
	pointLighter.position.z = Math.cos( time * 0.3) * 30; */
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
