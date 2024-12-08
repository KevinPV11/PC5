import { mockWithVideo } from './libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Inicializar MindAR
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '/static/assets/targets/targets_2.mind', // Ruta del target .mind
    });
    const { renderer, scene, camera } = mindarThree;

    // Luz para la escena
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Cargar la textura de los QR
    const textureLoader = new THREE.TextureLoader();
    const qrTextures = [
      textureLoader.load('/static/assets/models/QR/QR_biblioteca.jpg'), // QR 1
      textureLoader.load('/static/assets/models/QR/QR_CC.jpg'), // QR 2
      textureLoader.load('/static/assets/models/QR/QR_grupo.jpg'), // QR 3
      textureLoader.load('/static/assets/models/QR/QR_historia.jpg'), // QR 4
    ];

    // Crear planos para los 4 QR
    const planes = qrTextures.map((texture, index) => {
      const geometry = new THREE.PlaneGeometry(0.8, 0.8); // Tamaño de los planos
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);

      // Posicionar los planos (en un cuadrado alrededor del target)
      const positions = [
        { x: -0.5, y: 0.5, z: 0 }, // Arriba izquierda
        { x: 0.5, y: 0.5, z: 0 },  // Arriba derecha
        { x: -0.5, y: -0.5, z: 0 }, // Abajo izquierda
        { x: 0.5, y: -0.5, z: 0 },  // Abajo derecha
      ];
      plane.position.set(positions[index].x, positions[index].y, positions[index].z);

      return plane;
    });

    // Anclar los planos al target detectado
    const anchor = mindarThree.addAnchor(0); // Índice del target
    planes.forEach((plane) => anchor.group.add(plane));

    // Iniciar MindAR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };
  start();
});
