var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
orbitControls = null,
mainChar = null;

var duration = 20000; // ms

var currentTime = Date.now();

var initTimer = true, time = null, timer = 30;
var highScore = 0, score = 0;

var canvas = null;

var keypressed = false;

var mainCharBox = null, mainCharBoxHelper = null;
var move = null;
var colliderObjects = [], moveObjects = [], movementColliders = [], floorColliders = [], cars = [], woods = [];
var mainCharBoxSize = new THREE.Vector3( 1.5, 1.5, 1.5 );

var carAnimation = null, woodAnimation = [], objAnimation = null;

var collidesWater = false, collidesWood = false;

var land = 0;
var floorCollides = 0;

function createLandSection(line) {
    geometry = new THREE.PlaneGeometry(26, 2, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x5fba51, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -line * 2;
    mesh.tag = 'land';

    // Land collider
    let cubeBBox = new THREE.Box3().setFromObject(mesh);
    cubeBBox.tag = 'land';

    floorColliders.push(cubeBBox);

    let x = Math.floor(Math.random() * 13 - 6) * 2;

    if (line == 0) {
        while (x == mainChar.position.x)
            x = Math.floor(Math.random() * 13 - 6) * 2;
    }
    //let z = Math.floor(Math.random() * 3) * 2;
    material = new THREE.MeshPhongMaterial({ color: 0x106300 });
    geometry = new THREE.CubeGeometry(2, 5, 2);

    // And put the geometry and material together into a mesh
    let object = new THREE.Mesh(geometry, material);
    object.position.x = x;
    object.position.z = -line * 2;
    object.position.y = 1.5;

    // Collider
    cubeBBox = new THREE.Box3().setFromObject(object);
    //let cubeBBoxHelper = new THREE.BoxHelper(object, 0x00ff00);
    //console.log(cubeBBox);
    colliderObjects.push(cubeBBox);

    group.add(mesh);
    group.add(object);
    //group.add(cubeBBoxHelper);
}

function createStreetSection(line) {
    geometry = new THREE.PlaneGeometry(26, 2, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xbbbbbb, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -line * 2;

    mesh.tag = 'street';

    // Street collider
    cubeBBox = new THREE.Box3().setFromObject(mesh);
    cubeBBox.tag = 'street';

    floorColliders.push(cubeBBox);

    //let x = Math.floor(Math.random() * 13 - 6) * 2;
    //z = Math.floor(Math.random() * 3) * 2 + 6;
    let color = new THREE.Color('#'+Math.floor(Math.random()*16777215).toString(16));
    material = new THREE.MeshPhongMaterial({ color: color });
    geometry = new THREE.CubeGeometry(2, 2, 2);

    let object = new THREE.Mesh(geometry, material);
    //object.position.x = x;
    object.position.z = -line * 2;

    //cubeBBox = new THREE.Box3().setFromObject(object);
    //colliderObjects.push(cubeBBox);

    moveObjects.push(object);
    cars.push(object);

    objectMovement(object);
    
    group.add(mesh);
    group.add(object);
}

function createWaterSection(line) {
    geometry = new THREE.PlaneGeometry(26, 2, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -line * 2;

    group.add(mesh);

    //waterCollider
    cubeBBox = new THREE.Box3().setFromObject(mesh);
    cubeBBox.tag = 'water';

    floorColliders.push(cubeBBox);

    //z = Math.floor(Math.random() * 2 + 1) * 2 + 12;

    geometry = new THREE.PlaneGeometry(3, 2, 10, 10);
    object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xa52a2a }));
    object.rotation.x = -Math.PI / 2;
    object.position.z = -line * 2;
    object.position.y = -0.99;

    object.tag = 'wood';

    moveObjects.push(object);

    objectMovement(object);

    woods.push(object);
    group.add(object);

    woodAnimation.push(new KF.KeyFrameAnimator)
}

function createSection() {
    // Land
    /*geometry = new THREE.PlaneGeometry(26, 6, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x5fba51, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -2;
    mesh.tag = 'land';

    let x = Math.floor(Math.random() * 13 - 6) * 2;
    let z = Math.floor(Math.random() * 3) * 2;
    material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    geometry = new THREE.CubeGeometry(2, 5, 2);

    // And put the geometry and material together into a mesh
    let object = new THREE.Mesh(geometry, material);
    object.position.x = x;
    object.position.z = -z;
    object.position.y = 1.5;

    // Collider
    let cubeBBox = new THREE.Box3().setFromObject(object);
    let cubeBBoxHelper = new THREE.BoxHelper(object, 0x00ff00);
    //console.log(cubeBBox);
    colliderObjects.push(cubeBBox);

    group.add(mesh);
    group.add(object);
    group.add(cubeBBoxHelper);*/
    

    // Street
    /*
    geometry = new THREE.PlaneGeometry(26, 6, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xbbbbbb, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -8;

    mesh.tag = 'street';

    x = Math.floor(Math.random() * 13 - 6) * 2;
    z = Math.floor(Math.random() * 3) * 2 + 6;
    material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    geometry = new THREE.CubeGeometry(2, 2, 2);

    object = new THREE.Mesh(geometry, material);
    object.position.x = x;
    object.position.z = -z;

    cubeBBox = new THREE.Box3().setFromObject(object);
    colliderObjects.push(cubeBBox);

    moveObjects.push(object);
    cars.push(object);
    
    group.add(mesh);
    group.add(object);*/
    if (land == 0) {
        createLandSection(0);
        land++;
        while (land < 10) {
            let landChoice = Math.floor(Math.random() * 3);
            switch (landChoice) {
                case 0:
                    createLandSection(land);
                    break;

                case 1:
                    createStreetSection(land);
                    break;

                case 2:
                    createWaterSection(land);
                    break;
            }
            land++;
        }
    } else {
        let landChoice = Math.floor(Math.random() * 3);

        switch (landChoice) {
            case 0:
                createLandSection(land);
                break;
            case 1:
                createStreetSection(land);
                break;

            case 2:
                createWaterSection(land);
                break;
           }
        land++;   
    }

    

    /*
    // Water
    geometry = new THREE.PlaneGeometry(26, 6, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    mesh.position.z = -14;

    group.add(mesh);

    //waterCollider
    cubeBBox = new THREE.Box3().setFromObject(mesh);
    cubeBBox.tag = 'water';

    colliderObjects.push(cubeBBox);

    //z = Math.floor(Math.random() * 2 + 1) * 2 + 12;

    geometry = new THREE.PlaneGeometry(3, 2, 10, 10);
    object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xa52a2a }));
    object.rotation.x = -Math.PI / 2;
    object.position.z = -12;
    object.position.y = -0.99;

    object.tag = 'wood';

    moveObjects.push(object);

    woods.push(object);
    group.add(object);

    nObject = object.clone();
    nObject.position.z = -14;
    nObject.tag = 'wood';
    woods.push(nObject);
    group.add(nObject);

    moveObjects.push(nObject);

    nObject = object.clone();
    nObject.position.z = -16;
    nObject.tag = 'wood';
    woods.push(nObject);
    group.add(nObject);

    moveObjects.push(nObject);

    for (let x = 0; x < 3; x++)
        woodAnimation.push(new KF.KeyFrameAnimator)*/

    
    
}

function onKeyDown(event)
{
    if (!keypressed) {
        //console.log(event.keyCode);
        switch(event.keyCode)
        {
            case 38:
                mainChar.position.z -= 2;
                createSection();
                //group.position.z -= 2;
                move = 'up';
                camera.position.z -= 1.5;
                spotLight.position.z -= 1.5;

                break;

            case 37:
                mainChar.position.x -= 2;
                move = 'left';
                break;

            case 39:
                mainChar.position.x += 2;
                move = 'right';
                break;
        }

        //console.log(mainChar);
        keypressed = true;
    }
}

function onKeyUp(event)
{
    keypressed = false;
}

function doesItCrash() {
    //mainCharBoxHelper.update();
    //mainCharBox = new THREE.Box3().setFromObject(mainChar);
    mainCharBox = new THREE.Box3().setFromCenterAndSize(mainChar.position, mainCharBoxSize);
    mainCharDownBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(mainChar.position.x, mainChar.position.y - 0.5, mainChar.position.z),
       new THREE.Vector3(0, 1, 0));


    for (var collider of colliderObjects) {
        if (mainCharBox.intersectsBox(collider)) {
            console.log('Collides');
            switch(move) {
                case 'up':
                        mainChar.position.z += 2;
                        camera.position.z -= 1.5;
                        spotLight.position.z -= 1.5;
                        break;

                case 'right':
                        mainChar.position.x -= 2;
                        break;

                case 'left':
                        mainChar.position.x += 2;
                        break;

                default:
                        break;
            }

            move = 'else';
        }
    }

    floorCollides = 0;
    for (var collider of floorColliders) {
        if (mainCharDownBox.intersectsBox(collider)) {
            if (collider.tag == 'water'){
                collidesWater = true;
                console.log('Collides water ' + collider.tag);
            } else {
                //console.log(collider.tag);
                if (collider.tag == 'land' || collider.tag == 'street')
                    floorCollides = 1;
            }
        }
    }

    if (floorCollides == 0)
        collidesWater = true;

    for (var collider of movementColliders) {
        if (mainCharBox.intersectsBox(collider)) {
            console.log('Collides car');
            mainChar.position.x = 0;
            mainChar.position.y = 0;
            mainChar.position.z = 0;
            camera.position.z = 0;
        }

        if (mainCharDownBox.intersectsBox(collider)) {
            if (collider.tag == 'wood') {
                collidesWood = true;
                mainChar.position.x = collider.getCenter().x;
                console.log('Collides wood ' + collider.tag);
            }
        }
    }

    if (collidesWood) {
        collidesWood = false;
        collidesWater = false;
    }

    if (collidesWater) {
        mainChar.position.x = 0;
        mainChar.position.y = 0;
        mainChar.position.z = 0;
        collidesWood = false;
        collidesWater = false;
        camera.position.z = 0;
        spotLight.position.z = -10;
    }

}

function updateMovementColliders() {
    movementColliders = [];
    for (var moveColliders of moveObjects) {
        cubeBBox = new THREE.Box3().setFromObject(moveColliders);
        if (moveColliders.tag == 'wood') {
            //console.log('wood');
            cubeBBox.tag = 'wood'
            cubeBBox.theObject = movementColliders;
        }

        movementColliders.push(cubeBBox);
    }
}

function objectMovement(obj) {
    if (obj.tag == 'car')
        duration = (Math.random() * 5 + 1) * 1000;
    else
        duration = (Math.random() * 3 + 3) * 1000;

    objAnimation = new KF.KeyFrameAnimator;
    objAnimation.init({ 
        interps:
            [
                { 
                    keys:[0, .5, 1], 
                    values:[
                            { x : 12 },
                            { x : -12 },
                            { x : 12 },
                            ],
                    target:obj.position
                }
            ],
        loop: true,
        duration: duration
    });
    objAnimation.start();

}

/*function movementAnimation() {

    for (var car of cars) {
        duration = (Math.random() * 5 + 1) * 1000;
        //console.log(duration);
        carAnimation = new KF.KeyFrameAnimator;
        carAnimation.init({ 
            interps:
                [
                    { 
                        keys:[0, .5, 1], 
                        values:[
                                { x : 12 },
                                { x : -12 },
                                { x : 12 },
                                ],
                        target:car.position
                    }
                ],
            loop: true,
            duration: duration
        });
        carAnimation.start();
    }

    for (let x = 0; x < woods.length; x++) {
        duration = (Math.random() * 3 + 3) * 1000;
        woodAnimation[x].init({ 
            interps:
                [
                    { 
                        keys:[0, .5, 1], 
                        values:[
                                { x : 12 },
                                { x : -12 },
                                { x : 12 },
                                ],
                        target:woods[x].position
                    }
                ],
            loop: true,
            duration: duration
        });
        woodAnimation[x].start();
    }
}*/

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update objects that can move
        updateMovementColliders();

        // Collider detection
        doesItCrash();

        // Update the animations
        KF.update();

        // Update the camera controller
        //orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

    this.canvas = canvas;
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(40, 10, 0);

    //console.log(camera.rotation);
    //camera.rotation.set(Math.PI / 6, Math.PI / 2, 0);
    camera.rotation.y = Math.PI / 2;
    //console.log(camera.rotation);
    //camera.rotation.z = Math.PI / 6;
    //console.log(camera.rotation);

    //camera.position.set(16.97737797237124, 23.745799149115435, 7.846899104304361)
    scene.add(camera);

    //orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(-30, 8, -10);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create the objects
    // loadFBX();
    /*geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    scene.add(object);*/

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    /*var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    */

    var material = new THREE.MeshPhongMaterial({ color: 0xfcb02d });
    geometry = new THREE.CubeGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    mainChar = new THREE.Mesh(geometry, material);

    //mainCharBoxHelper =new THREE.BoxHelper(mainChar, 0x00ff00);



    root.add(mainChar);
    //root.add(mainCharBoxHelper);

    createSection();

    // Create the animations
    //movementAnimation();

    // Now add the group to our scene
    scene.add( root );
}