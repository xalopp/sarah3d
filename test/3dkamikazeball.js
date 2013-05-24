var scene, renderer, camera, animatedObjects = [];
var doCameraAnimation = true;
var walls = [];
var ballObj = null;
var controls = {
    moveLeft: false,
    moveRight: false
};

var Ball = function () {
    'use strict';

    this.roll = true;

    this.ball = new THREE.SphereGeometry(50, 64, 32);
    this.texture = THREE.ImageUtils.loadTexture( "images/Befehlsblume.jpg" );
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping; this.texture.repeat.set( 1, 1 );
    //this.material = new THREE.MeshPhongMaterial({ color : 0xffff00, wireframe : true });
    this.material = new THREE.MeshPhongMaterial( { map: this.texture, color: 0xffffff, wireframe: false } );
    this.mesh = new THREE.Mesh(this.ball, this.material);
    this.mesh.position.y = -400;
    this.mesh.position.x = 0;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.doAnimation = function () {
        this.mesh.position.y += 1;
        if (this.mesh.position.y > 500) {
            this.mesh.position.y = 500;
        }
        if (camera.position.y < 400) {
            this.mesh.rotation.x -= 0.1;
            camera.position.y += 1;
        }
    };
};

var Ground = function () {
    'use strict';

    this.ground = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    this.material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture( "images/stone_ground.jpg" ),
        shading: THREE.SmoothShading
    });
    this.mesh = new THREE.Mesh(this.ground, this.material);
    this.mesh.position.z = -50;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
//    this.mesh.rotation.x = 90;
};

var Wall = function (x, y, w) {
    'use strict';

    //this.ground = new THREE.PlaneGeometry(w, 100, 10, 10);
    this.ground = new THREE.CubeGeometry(w, 100, 10, w, 10, 10);
    this.material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture( "images/stonewall.jpg" ) });
    this.mesh = new THREE.Mesh(this.ground, this.material);
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = 0;
    this.mesh.rotation.x = Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
};

function addWall(x, y , w) {
    var wall =  new Wall(x, y, w);
    walls.push(wall);
    scene.add(wall.mesh);
}

function cameraAnimation() {
    'use strict';

    if (doCameraAnimation) {
        camera.rotation.x += Math.PI / 360;
        camera.position.y = -800 * Math.sin(camera.rotation.x);
        camera.position.z = 650 * Math.cos(camera.rotation.x);
        if (camera.rotation.x > (Math.PI / 4)) {
            doCameraAnimation = false;
        }
    }
}

function checkMovement(obj) {

    if(controls.moveLeft) {
        obj.mesh.position.x -= 5;
    } else if (controls.moveRight) {
        obj.mesh.position.x += 5;
    }
}

function initKeyboard() {
    document.addEventListener('keydown', function(evt) {
        switch (evt.keyCode) {
            case 37: /*left*/
                controls.moveLeft = true;
                break;
            case 65: /*A*/
                controls.moveLeft = true;
                break;

            case 39: /*right*/
                controls.moveRight = true;
                break;
            case 68: /*D*/
                controls.moveRight = true;
                break;
        }

    }, false);
    document.addEventListener('keyup', function(evt) {
        switch (evt.keyCode) {
            case 37: /*left*/
                controls.moveLeft = false;
                break;
            case 65: /*A*/
                controls.moveLeft = false;
                break;

            case 39: /*right*/
                controls.moveRight = false;
                break;
            case 68: /*D*/
                controls.moveRight = false;
                break;
        }
    }, false);
}

var KamikazeBall3D = {
    init : function () {
        'use strict';
        var hemisphereLight,
            ball = new Ball(),
            ground = new Ground();

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = -0;
        camera.position.y = -800;
        camera.position.z = 650;
        camera.rotation.x = 0;
//        camera.position.y = -600;
//        camera.position.z = 0;
//        camera.rotation.x = Math.PI / 2;

        //ambient light, else the full seen is very dark
        var ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );


        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( camera.position.x, camera.position.y, camera.position.z );
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.shadowDarkness = 0.5;

        scene.add(spotLight);
        scene.add(ground.mesh);
        animatedObjects.push(ball);
        ballObj = ball;
        scene.add(ball.mesh);

        addWall(300, 300, 300);
        addWall(-300, 400, 100);
        addWall(-200, -200, 200);
        addWall(-100, 100, 200);
        addWall(300, -100, 400);

        initKeyboard();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        //enable shadow plugin
        renderer.shadowMapEnabled = true;
        //anti aliasing
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);
    },

    animate : function () {
        'use strict';
        var i, o;

        requestAnimationFrame(KamikazeBall3D.animate);
        checkMovement(ballObj);

        cameraAnimation();
        //enlarge the ground
        //this.offset.set(position.x / w * seaTex.repeat.x, position.y / h * seaTex.repeat.y);
        for (i = 0; i < animatedObjects.length; i = i + 1) {
            o = animatedObjects[i];
            if (o.hasOwnProperty('doAnimation')) {
                o.doAnimation();
            }
        }
        renderer.render(scene, camera);
    }
};

function ready() {
    'use strict';

    KamikazeBall3D.init();
    KamikazeBall3D.animate();
}

$(document).ready(ready());