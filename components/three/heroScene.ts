import * as THREE from "three";

/**
 * Scène 3D du héros en Three.js « vanilla ».
 *
 * Version allégée : plus AUCUN calcul par sommet à chaque image (la distorsion
 * CPU + recompute des normales était le principal coût). À la place, un cristal
 * facetté basse-résolution (flatShading) qui tourne, une coque en fil de fer
 * contre-rotative et un champ d'étoiles. Le rendu se résume à des transforms.
 *
 * La boucle se met en PAUSE dès que le héros sort du viewport ou que l'onglet
 * est masqué → aucune dépense CPU/GPU quand ce n'est pas visible.
 *
 * Retourne une fonction de nettoyage.
 */
export function createHeroScene(container: HTMLElement): () => void {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  // — Cristal facetté (statique, flatShading) —
  const geo = new THREE.IcosahedronGeometry(1.35, 1); // 42 sommets, look « gemme »
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0f2b2a,
    emissive: 0x4fe3c1,
    emissiveIntensity: 0.4,
    roughness: 0.25,
    metalness: 0.6,
    flatShading: true,
  });
  const blob = new THREE.Mesh(geo, mat);

  // — Coque en fil de fer —
  const wireGeo = new THREE.IcosahedronGeometry(1.7, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x4fe3c1,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);

  const group = new THREE.Group();
  group.add(blob, wire);
  scene.add(group);

  // — Champ d'étoiles (réduit) —
  const STARS = 550;
  const starPos = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const r = 8 + Math.random() * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi) - 6;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xeaf0f8,
      size: 0.03,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    })
  );
  scene.add(stars);

  // — Lumières —
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0x6effd8, 2.4);
  key.position.set(4, 3, 5);
  const rim = new THREE.DirectionalLight(0xff6b5e, 1.3);
  rim.position.set(-5, -2, -3);
  scene.add(key, rim);

  // — Dimensionnement maîtrisé (DPR plafonné à 1.35 pour alléger le fill-rate) —
  const setSize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(container);

  // — Suivi du curseur (parallaxe) —
  const pointer = { x: 0, y: 0 };
  const onMove = (e: MouseEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("mousemove", onMove);

  // — Boucle d'animation, en pause hors écran / onglet masqué —
  // Temps écoulé maison (THREE.Clock est déprécié) : on n'accumule PAS le temps
  // passé en pause, donc pas de saut d'animation à la reprise.
  let elapsed = 0;
  let lastT = 0;
  let raf = 0;
  let running = false;

  const tick = () => {
    const now = performance.now();
    elapsed += Math.min((now - lastT) / 1000, 0.05); // dt plafonné
    lastT = now;
    const t = elapsed;

    // Léger « pouls » d'échelle, sans toucher aux sommets
    const pulse = 1 + Math.sin(t * 1.2) * 0.03;
    blob.scale.setScalar(pulse);

    blob.rotation.y += 0.0035;
    blob.rotation.x += 0.0012;
    wire.rotation.y -= 0.0022;
    wire.rotation.z += 0.001;
    stars.rotation.y = t * 0.02;

    group.rotation.y += (pointer.x * 0.35 - group.rotation.y) * 0.04;
    group.rotation.x += (pointer.y * 0.22 - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || document.hidden) return;
    running = true;
    lastT = performance.now(); // repart de maintenant : le temps en pause est ignoré
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  // Ne tourne que lorsque le héros est visible à l'écran
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.01 }
  );
  io.observe(container);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  // — Nettoyage —
  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("mousemove", onMove);
    geo.dispose();
    mat.dispose();
    wireGeo.dispose();
    wireMat.dispose();
    starGeo.dispose();
    (stars.material as THREE.Material).dispose();
    renderer.forceContextLoss();
    renderer.dispose();
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
