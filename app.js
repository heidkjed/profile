// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('background-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // シャドウを有効にする

// 窓サイズに応じてレンダラーとカメラをリサイズ
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // オブジェクトのサイズもウィンドウに比例して変化するが、最大サイズを制限する
    if (object) {
        const scaleFactor = Math.min(width, height) / 1000;
        const maxScale = 0.5; // 最大サイズの制限
        const limitedScale = Math.min(scaleFactor, maxScale); // 最大値に制限

        object.scale.set(limitedScale, limitedScale, limitedScale);
    }
});



let object;  // グローバル変数にオブジェクトを格納

// OBJLoaderで3Dモデルを読み込む
const loader = new THREE.OBJLoader();
loader.load('v_02.obj', function (loadedObject) {
    object = loadedObject;
    object.scale.set(0.5, 0.5, 0.5); // モデルのサイズを調整
    object.castShadow = true;  // モデルが影を落とす

    // マテリアルを定義
    const material = new THREE.MeshStandardMaterial({
        color: 0xD3D3D3, // 色を設定
        metalness: 0.4, // 金属感の設定
        roughness: 0.1  // 粗さの設定
    });

    // マテリアルを各メッシュに適用
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = material; // 各メッシュにマテリアルを設定
        }
    });

    scene.add(object);

    animate(); // モデルのロード後にアニメーションを開始
}, undefined, function (error) {
    console.error(error);
});

// 環境光を追加
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 環境光をシーンに追加
scene.add(ambientLight);

// 方向光を追加
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5); // 方向光の位置を設定
directionalLight.castShadow = true; // 影を有効にする
scene.add(directionalLight);

// スクロールイベントをリスンしてモデルを回転させる
window.addEventListener('scroll', () => {
    if (object) {
        const scrollY = window.scrollY; // 縦スクロールの位置
        object.rotation.y = scrollY * 0.01; // スクロール量に応じて回転させる
        object.rotation.x = scrollY * 0.005; // X軸の回転も追加する場合
    }
});

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    // シーンをレンダリング
    renderer.render(scene, camera);
}

animate();
