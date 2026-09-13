"use strict";

/*
===========================================================
OCULO3D — STABLE MAIN ENGINE
===========================================================
Core renderer + eye + interaction + anatomical views
===========================================================
*/

window.OculoApp = {

    scene: null,
    camera: null,
    renderer: null,

    eye: null,
    anatomy: null,

    raycaster: null,
    pointer: new THREE.Vector2(),

    dragging: false,

    lastX: 0,
    lastY: 0,

    downX: 0,
    downY: 0,

    zoom: 6,

    activeView: "complete",

    selectedObject: null
};


// =========================================================
// START
// =========================================================

function startOculo3D() {

    try {

        createScene();
        createCamera();
        createRenderer();
        createLighting();

        createEye();

        createInteraction();
        createInterface();

        animate();

        window.addEventListener(
            "resize",
            resizeRenderer
        );

        console.log("Oculo3D engine started.");

    }

    catch (error) {

        console.error(
            "Oculo3D startup error:",
            error
        );

    }

}


// =========================================================
// SCENE
// =========================================================

function createScene() {

    OculoApp.scene =
        new THREE.Scene();

    OculoApp.scene.background =
        new THREE.Color(0x03070b);

}


// =========================================================
// CAMERA
// =========================================================

function createCamera() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    OculoApp.camera =
        new THREE.PerspectiveCamera(
            42,
            width / height,
            0.1,
            100
        );

    OculoApp.camera.position.set(
        0,
        0,
        OculoApp.zoom
    );

    OculoApp.camera.lookAt(
        0,
        0,
        0
    );

}


// =========================================================
// RENDERER
// =========================================================

function createRenderer() {

    OculoApp.renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference:
                "high-performance"
        });

    OculoApp.renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    OculoApp.renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    OculoApp.renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    OculoApp.renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    OculoApp.renderer.toneMappingExposure =
        1.05;

    document
        .getElementById("app")
        .appendChild(
            OculoApp.renderer.domElement
        );

}


// =========================================================
// LIGHTING
// =========================================================

function createLighting() {

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.8
        );

    OculoApp.scene.add(
        ambient
    );


    const key =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    key.position.set(
        4,
        5,
        6
    );

    OculoApp.scene.add(
        key
    );


    const fill =
        new THREE.DirectionalLight(
            0x8ddcff,
            1.2
        );

    fill.position.set(
        -5,
        2,
        4
    );

    OculoApp.scene.add(
        fill
    );


    const rim =
        new THREE.DirectionalLight(
            0x5577ff,
            1.4
        );

    rim.position.set(
        0,
        -4,
        -6
    );

    OculoApp.scene.add(
        rim
    );

}


// =========================================================
// EYE
// =========================================================

function createEye() {

    if (
        !window.OculoEye
    ) {

        throw new Error(
            "OculoEye module not loaded."
        );

    }


    OculoApp.eye =
        OculoEye.createEye();


    OculoApp.scene.add(
        OculoApp.eye
    );


    /*
    Core ocular anatomy.
    */

    OculoEye.buildAdvancedAnatomy(
        OculoApp.eye
    );


    /*
    Advanced external anatomy.

    If this module fails, the basic eye
    will STILL remain functional.
    */

    if (
        window.OculoAnatomy
    ) {

        try {

            OculoApp.anatomy =
                OculoAnatomy.buildAnatomy(
                    OculoApp.eye
                );

        }

        catch (error) {

            console.warn(
                "Advanced anatomy disabled:",
                error
            );

            OculoApp.anatomy = null;

        }

    }

}


// =========================================================
// INTERACTION
// =========================================================

function createInteraction() {

    const canvas =
        OculoApp.renderer
            .domElement;


    canvas.addEventListener(
        "pointerdown",
        onPointerDown
    );

    canvas.addEventListener(
        "pointermove",
        onPointerMove
    );

    canvas.addEventListener(
        "pointerup",
        onPointerUp
    );

    canvas.addEventListener(
        "pointercancel",
        onPointerUp
    );


    canvas.addEventListener(
        "wheel",
        onWheel,
        {
            passive: false
        }
    );

}


// =========================================================
// POINTER DOWN
// =========================================================

function onPointerDown(event) {

    OculoApp.dragging = true;

    OculoApp.lastX =
        event.clientX;

    OculoApp.lastY =
        event.clientY;

    OculoApp.downX =
        event.clientX;

    OculoApp.downY =
        event.clientY;

}


// =========================================================
// POINTER MOVE
// =========================================================

function onPointerMove(event) {

    if (
        !OculoApp.dragging ||
        !OculoApp.eye
    ) {
        return;
    }


    const dx =
        event.clientX -
        OculoApp.lastX;

    const dy =
        event.clientY -
        OculoApp.lastY;


    OculoApp.eye.rotation.y +=
        dx * 0.008;

    OculoApp.eye.rotation.x +=
        dy * 0.008;


    OculoApp.eye.rotation.x =
        THREE.MathUtils.clamp(
            OculoApp.eye.rotation.x,
            -1.3,
            1.3
        );


    OculoApp.lastX =
        event.clientX;

    OculoApp.lastY =
        event.clientY;

}


// =========================================================
// POINTER UP
// =========================================================

function onPointerUp(event) {

    if (
        !OculoApp.dragging
    ) {
        return;
    }


    OculoApp.dragging =
        false;


    const movement =
        Math.hypot(
            event.clientX -
                OculoApp.downX,

            event.clientY -
                OculoApp.downY
        );


    if (
        movement < 12
    ) {

        selectStructure(
            event.clientX,
            event.clientY
        );

    }

}


// =========================================================
// ZOOM
// =========================================================

function onWheel(event) {

    event.preventDefault();

    OculoApp.zoom +=
        event.deltaY * 0.0025;


    OculoApp.zoom =
        THREE.MathUtils.clamp(
            OculoApp.zoom,
            3.5,
            10
        );


    OculoApp.camera.position.z =
        OculoApp.zoom;

}


// =========================================================
// STRUCTURE SELECTION
// =========================================================

function selectStructure(x, y) {

    if (
        !OculoApp.raycaster
    ) {

        OculoApp.raycaster =
            new THREE.Raycaster();

    }


    const canvas =
        OculoApp.renderer
            .domElement;

    const rect =
        canvas.getBoundingClientRect();


    OculoApp.pointer.x =
        ((x - rect.left) /
            rect.width) * 2 - 1;

    OculoApp.pointer.y =
        -((y - rect.top) /
            rect.height) * 2 + 1;


    OculoApp.raycaster.setFromCamera(
        OculoApp.pointer,
        OculoApp.camera
    );


    const hits =
        OculoApp.raycaster.intersectObjects(
            OculoApp.scene.children,
            true
        );


    if (
        hits.length === 0
    ) {

        return;

    }


    let object =
        hits[0].object;


    while (
        object &&
        object.parent &&
        object.name === ""
    ) {

        object =
            object.parent;

    }


    if (
        object &&
        object.name
    ) {

        showAnatomicalInfo(
            object.name
        );

    }

}


// =========================================================
// INTERFACE
// =========================================================

function createInterface() {

    const buttons =
        document.querySelectorAll(
            ".anatomy-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    changeAnatomicalView(
                        button.dataset.view
                    );

                }
            );

        }
    );

}


// =========================================================
// HIDE STRUCTURE
// =========================================================

function hideStructure(name) {

    if (
        OculoEye.anatomy &&
        OculoEye.anatomy[name]
    ) {

        OculoEye.anatomy[name]
            .visible = false;

    }

}


// =========================================================
// RESET CORE ANATOMY
// =========================================================

function resetCoreAnatomy() {

    Object.values(
        OculoEye.anatomy
    ).forEach(
        structure => {

            if (
                structure &&
                structure.isObject3D
            ) {

                structure.visible = true;

            }

        }
    );

}


// =========================================================
// ANATOMICAL VIEWS
// =========================================================

function changeAnatomicalView(view) {

    OculoApp.activeView =
        view;


    resetCoreAnatomy();


    /*
    Reset advanced anatomy.
    */

    if (
        OculoApp.anatomy
    ) {

        if (
            OculoApp.anatomy.opticNerve
        ) {

            OculoApp.anatomy
                .opticNerve.visible = false;

        }

        if (
            OculoApp.anatomy.opticPathway
        ) {

            OculoApp.anatomy
                .opticPathway.visible = false;

        }

        if (
            OculoApp.anatomy.muscles
        ) {

            OculoApp.anatomy
                .muscles.visible = false;

        }

    }


    /*
    Complete eye.
    */

    if (
        view === "complete"
    ) {

        OculoApp.eye.rotation.y = 0;

        showAnatomicalInfo(
            "Ocular Globe"
        );

        return;

    }


    /*
    Anterior segment.
    */

    if (
        view === "anterior"
    ) {

        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");

        showAnatomicalInfo(
            "Cornea"
        );

        return;

    }


    /*
    Posterior segment.
    */

    if (
        view === "posterior"
    ) {

        OculoApp.eye.rotation.y =
            Math.PI;


        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");


        if (
            OculoApp.anatomy &&
            OculoApp.anatomy.opticNerve
        ) {

            OculoApp.anatomy
                .opticNerve.visible = true;

        }


        showAnatomicalInfo(
            "Retina"
        );

        return;

    }


    /*
    Optic pathway.
    */

    if (
        view === "optic"
    ) {

        OculoApp.eye.rotation.y =
            Math.PI;


        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");


        if (
            OculoApp.anatomy
        ) {

            if (
                OculoApp.anatomy.opticNerve
            ) {

                OculoApp.anatomy
                    .opticNerve.visible = true;

            }

            if (
                OculoApp.anatomy.opticPathway
            ) {

                OculoApp.anatomy
                    .opticPathway.visible = true;

            }

        }


        showAnatomicalInfo(
            "Optic Nerve"
        );

        return;

    }


    /*
    Extraocular muscles.
    */

    if (
        view === "muscles"
    ) {

        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");


        if (
            OculoApp.anatomy &&
            OculoApp.anatomy.muscles
        ) {

            OculoApp.anatomy
                .muscles.visible = true;

        }


        showAnatomicalInfo(
            "Extraocular Muscles"
        );

    }

}


// =========================================================
// INFORMATION
// =========================================================

function showAnatomicalInfo(name) {

    const title =
        document.getElementById(
            "infoTitle"
        );

    const text =
        document.getElementById(
            "infoText"
        );


    if (!title || !text) {
        return;
    }


    const database = {

        "Ocular Globe": [
            "Ocular Globe",
            "The eyeball is a complex organ responsible for receiving and processing visual information."
        ],

        "Sclera": [
            "Sclera",
            "The tough fibrous outer coat of the eyeball."
        ],

        "Cornea": [
            "Cornea",
            "The transparent anterior portion of the eye and an important refractive surface."
        ],

        "Iris": [
            "Iris",
            "The pigmented diaphragm that regulates the amount of light entering through the pupil."
        ],

        "Pupil": [
            "Pupil",
            "The central aperture of the iris through which light enters the eye."
        ],

        "Lens": [
            "Lens",
            "The transparent biconvex structure responsible for fine focusing of light."
        ],

        "Retina": [
            "Retina",
            "The neurosensory layer containing photoreceptors and retinal neural circuits."
        ],

        "Choroid": [
            "Choroid",
            "The vascular pigmented layer between the retina and sclera."
        ],

        "Vitreous Body": [
            "Vitreous Body",
            "The transparent gel occupying most of the posterior segment."
        ],

        "Optic Nerve": [
            "Optic Nerve",
            "Cranial nerve II carries visual information from the retina toward the optic chiasm."
        ],

        "Extraocular Muscles": [
            "Extraocular Muscles",
            "Six muscles control the movements of the eyeball."
        ]

    };


    const data =
        database[name];


    if (data) {

        title.textContent =
            data[0];

        text.textContent =
            data[1];

    }
    else {

        title.textContent =
            name;

        text.textContent =
            "Select an anatomical structure to explore its anatomy and clinical significance.";

    }

}


// =========================================================
// ANIMATION
// =========================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        OculoApp.renderer &&
        OculoApp.scene &&
        OculoApp.camera
    ) {

        OculoApp.renderer.render(
            OculoApp.scene,
            OculoApp.camera
        );

    }

}


// =========================================================
// RESIZE
// =========================================================

function resizeRenderer() {

    if (
        !OculoApp.camera ||
        !OculoApp.renderer
    ) {
        return;
    }


    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    OculoApp.camera.aspect =
        width / height;


    OculoApp.camera.updateProjectionMatrix();


    OculoApp.renderer.setSize(
        width,
        height
    );

}


// =========================================================
// BOOT
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startOculo3D
    );

}
else {

    startOculo3D();

}