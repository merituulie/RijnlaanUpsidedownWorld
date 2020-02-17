//use texture for each side
var cubeMaterials = [ //-> doubleside => frontside or backside
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // RIGHT SIDE
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // LEFT SIDE
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // TOP SIDE
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // BOTTOM SIDE
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ), // FRONT SIDE
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'Images/damagedTile.png'), side: THREE.DoubleSide } ) // BACK SIDE
]; // var material = new THREE.MeshFaceMaterial( cubeMaterials );
		var cube = new THREE.Mesh( geometry, material );
	
/* // skybox
var skyboxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000);
var skyboxMaterials = [
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } ),
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } ),
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } ),
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } ),
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } ),
	new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('Images/skybox.png') } )
];
var skyboxMaterial = new THREE.MeshFaceMaterial( skyboxMaterials );
var skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterial );
scene.add( skybox ); */