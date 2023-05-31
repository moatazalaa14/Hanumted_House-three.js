import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'






/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

const fog=new THREE.Fog('#262837',1,15)
// Scene
const scene = new THREE.Scene()
scene.fog=fog
/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

//Walls Texture
const wallsColorTexture=textureLoader.load('textures/bricks/color.jpg')
const wallsNormalTexture=textureLoader.load('textures/bricks/normal.jpg')
const wallsAmbientOcclusionTexture=textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const wallsRoughnessTexture=textureLoader.load('textures/bricks/roughness.jpg')



//Door Textures
const doorColorTextures=textureLoader.load("/textures/door/color.jpg")
const doorAlphaTextures=textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTextures=textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTextures=textureLoader.load("/textures/door/height.jpg")
const doorNormalTextures=textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTextures=textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTextures=textureLoader.load("/textures/door/roughness.jpg")



//grass
const grassColorTexture=textureLoader.load('textures/grass/color.jpg')
const grassNormalTexture=textureLoader.load('textures/grass/normal.jpg')
const grassAmbientOcclusionTexture=textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture=textureLoader.load('textures/grass/roughness.jpg')


grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)
grassColorTexture.repeat.set(8,8)


grassAmbientOcclusionTexture.wrapS=THREE.RepeatWrapping
grassNormalTexture.wrapS=THREE.RepeatWrapping
grassRoughnessTexture.wrapS=THREE.RepeatWrapping
grassColorTexture.wrapS=THREE.RepeatWrapping

grassAmbientOcclusionTexture.wrapT=THREE.RepeatWrapping
grassNormalTexture.wrapT=THREE.RepeatWrapping
grassRoughnessTexture.wrapT=THREE.RepeatWrapping
grassColorTexture.wrapT=THREE.RepeatWrapping

/**
 * House
 */
const house=new THREE.Group()

//walls
const wallsGeometry=new THREE.BoxGeometry(4,2.5,4)
const wallsMaterial=new THREE.MeshStandardMaterial({
    map:wallsColorTexture,
    aoMap:wallsAmbientOcclusionTexture,
    normalMap:wallsNormalTexture,
    roughnessMap:wallsRoughnessTexture


})

const wallsMesh=new THREE.Mesh(wallsGeometry,wallsMaterial)
wallsMesh.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(wallsMesh.geometry.attributes.uv.array,2))

house.add(wallsMesh)
wallsMesh.position.y=2.5/2

//Roof
const roofMesh=new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:"red"})
)
roofMesh.position.y=2.5 +.5
roofMesh.rotation.y=Math.PI*.25
house.add(roofMesh)

//plane
const planeMesh=new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColorTextures,
        alphaMap:doorAlphaTextures,
        transparent:true,
        aoMap:doorAmbientOcclusionTextures,
        displacementMap:doorHeightTextures,
        displacementScale:.1,
        normalMap:doorNormalTextures,
        metalnessMap:doorMetalnessTextures,
        roughnessMap:doorRoughnessTextures

    })
)
planeMesh.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(planeMesh.geometry.attributes.uv.array,2))
planeMesh.position.y=1
planeMesh.position.z=2+0.001
house.add(planeMesh)

//Bushes
const bushGeometry=new THREE.SphereGeometry(1,16,16)
const bushMaterial=new THREE.MeshStandardMaterial({color:"#89c854"})


//bush.1
const bush1=new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(.5,.5,.5)
bush1.position.set(.8,.2,2.2)

//bush.2
const bush2=new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(.25,.25,.25)
bush2.position.set(1.4,.1,2.1)


//bush.3
const bush3=new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(.3,.3,.3)
bush3.position.set(-.8,.2,2.2)

//bush.4
const bush4=new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(.15,.15,.15)
bush4.position.set(-0.9,.05,2.5)

house.add(bush1,bush2,bush3,bush4)


scene.add(house)

//graves

const graves=new THREE.Group()
const graveGeometry=new THREE.BoxGeometry(.6,.8,.2)
const graveMaterial=new THREE.MeshStandardMaterial({color:"#b2b6b1"})

for(let i=0;i<50;i++){

    const angle=Math.random()*Math.PI*2
    const radius=3 + Math.random()*6
    const graveMesh=new THREE.Mesh(graveGeometry,graveMaterial)

   
    graveMesh.position.set(Math.sin(angle)*radius,.8/2 +0.001,Math.cos(angle)*radius)

    graveMesh.rotation.set((Math.random()-.5)*.4,0,(Math.random()-.5)*.4)
    graveMesh.castShadow=true
    graves.add(graveMesh)
}


scene.add(graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
    })
)
floor.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)





/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow=true
scene.add(moonLight)

//Point Light

const doorLight=new THREE.PointLight("#ff7d46",1,7)

doorLight.position.set(0,2.2,2.7)
doorLight.castShadow=true
scene.add(doorLight)


//Ghosts

const ghost1=new THREE.PointLight("#ff00ff",2,3)
scene.add(ghost1)

const ghost2=new THREE.PointLight("#ffff00",2,3)
scene.add(ghost2)
const ghost3=new THREE.PointLight("#0000ff",2,3)
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)

controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( "#262837", 1);
renderer.shadowMap.enabled=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true
wallsMesh.castShadow=true;
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true
bush4.castShadow=true
floor.receiveShadow=true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const angle=elapsedTime*.5
        ghost1.position.x=Math.cos(angle)*4
    ghost1.position.z=Math.sin(angle)*4
    ghost1.position.y=Math.sin(elapsedTime*3)
    
    const angle2=elapsedTime*.32

    ghost2.position.x=Math.cos(angle2)*2
    ghost2.position.z=Math.sin(angle2)*4
    ghost2.position.y=Math.sin(elapsedTime *3)

    const angle3=-elapsedTime*.10

    ghost3.position.x=Math.cos(angle3)*7
    ghost3.position.z=Math.sin(angle3)*5
    ghost3.position.y=Math.sin(elapsedTime*3)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick() 


const audio=new Audio('/ghost-whispers-6030.mp3')
audio.play()
audio.volume = 0.2;
audio.autoplay=true
// audio.loop=true

