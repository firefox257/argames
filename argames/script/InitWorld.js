import * as THREE from 'three'

import Stats from 'three/addons/libs/stats.module.js'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Water } from 'three/addons/objects/Water.js'
import { Sky } from 'three/addons/objects/Sky.js'

//alert('initworld');
var InitWorld = async () => {
    //alert('init world')
    let container, stats
    let camera, scene, renderer
    let controls, water, sun, mesh

    container = $new(
        {
            $type: 'span',
            style: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0
            }
        },
        'body'
    )

    //container = $q("#worldview");

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(animate)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5
    container.appendChild(renderer.domElement)

    //

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        20000
    )
    camera.position.set(0, 3, 10)
    //
    sun = new THREE.Vector3()
    // Water

    //const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

   const waterGeometry = new THREE.BoxGeometry(1, 1, 1)
	const w1g = new THREE.BoxGeometry(1, 1, 1);
	w1g.translate(1,0,0);

    water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            'textures/waternormals.jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x0090ff, //0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    });
	
	var w1 = new Water(w1g, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            'textures/waternormals.jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x0090ff, //0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    })

    water.rotation.x = -Math.PI / 2
	w1.rotation.x = -Math.PI / 2
    scene.add(water)
	scene.add(w1)
    // Skybox

    const sky = new Sky()
    sky.scale.setScalar(10000)
    scene.add(sky)
    const skyUniforms = sky.material.uniforms
    skyUniforms['turbidity'].value = 10
    skyUniforms['rayleigh'].value = 2
    skyUniforms['mieCoefficient'].value = 0.005
    skyUniforms['mieDirectionalG'].value = 0.8

    const parameters = {
        elevation: 2,
        azimuth: 180
    }

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const sceneEnv = new THREE.Scene()

    let renderTarget
    //*/
    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
        const theta = THREE.MathUtils.degToRad(parameters.azimuth)

        sun.setFromSphericalCoords(1, phi, theta)

        sky.material.uniforms['sunPosition'].value.copy(sun)
        water.material.uniforms['sunDirection'].value.copy(sun).normalize()

        if (renderTarget !== undefined) renderTarget.dispose()

        sceneEnv.add(sky)
        renderTarget = pmremGenerator.fromScene(sceneEnv)
        scene.add(sky)
        scene.environment = renderTarget.texture
    }
    updateSun()
    const geometry = new THREE.BoxGeometry(30, 30, 30)
    const material = new THREE.MeshStandardMaterial({ roughness: 0 })

    //mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    //

    /*
			controls = new OrbitControls( camera, renderer.domElement );
			controls.maxPolarAngle = Math.PI * 2;//Math.PI * 0.495;
			controls.target.set( 0, 10, 0 );
			controls.minDistance = 40.0;
			controls.maxDistance = 200.0;
			controls.update();
			//*/
    //

    function animate() {
        render()

        //stats.update();
    }

    function render() {
        const time = performance.now() * 0.001;
        $msgc('world animate', time)

        //mesh.position.y = Math.sin( time ) * 20 + 5;
        //mesh.rotation.x = time * 0.5;
        //mesh.rotation.z = time * 0.51;

        water.material.uniforms['time'].value += 1.0 / 120.0;
w1.material.uniforms['time'].value += 1.0 / 120.0;
        renderer.render(scene, camera)
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize)

    //alert('here1')
}
$msgc.add('init world', InitWorld)
