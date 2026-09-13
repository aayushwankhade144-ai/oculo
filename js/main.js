/* =========================================================
   OCULO3D — MAIN ENGINE
========================================================= */

"use strict";

const OculoApp = {

    scene: null,
    camera: null,
    renderer: null,

    eye: null,

    clock: new THREE.Clock(),

    rotation: {
        x: 0,
        y: 0
    },

    targetRotation: {
        x: 0,
        y: 0
    },

    cameraDistance: 7,
    targetDistance: 7,

    dragging: false,
    moved: false,

    pointer: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
    },

    raycaster:
        new THREE.Raycaster()

};


/* =========================================================
   INITIALIZATION
========================================================= */

function startOculo3D() {

    createScene();

    createCamera();

    createRenderer();

    createLighting();

    createAnatomicalEye();

    createControls();

    createInterface();

    window.addEventListener(
        "resize",
        resizeRenderer
    );

    animate();
}


/* =========================================================
   SCENE
========================================================= */

function createScene() {

    OculoApp.scene =
        new THREE.Scene();

    OculoApp.scene.background =
        new THREE.Color(0x03070b);

    OculoApp.scene.fog =
        new THREE.FogExp2(
            0x03070b,
            0.025
        );
}


/* =========================================================
   CAMERA
========================================================= */

function createCamera() {

    OculoApp.camera =
        new THREE.PerspectiveCamera(
            42,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );

    OculoApp.camera.position.set(
        0,
        0,
        OculoApp.cameraDistance
    );
}


/* =========================================================
   RENDERER
========================================================= */

function createRenderer() {

    OculoApp.renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            powerPreference:
                "high-performance"

        });

    OculoApp.renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            1.8
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
        1.1;

    document
        .getElementById("app")
        .appendChild(
            OculoApp.renderer.domElement
        );
}


/* =========================================================
   LIGHTING
========================================================= */

function createLighting() {

    const hemisphere =
        new THREE.HemisphereLight(
            0xbcecff,
            0x080b10,
            2.0
        );

    OculoApp.scene.add(
        hemisphere
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3.2
        );

    keyLight.position.set(
        4,
        6,
        8
    );

    OculoApp.scene.add(
        keyLight
    );


    const rimLight =
        new THREE.PointLight(
            0x38c9ff,
            12,
            20
        );

    rimLight.position.set(
        -5,
        2,
        -6
    );

    OculoApp.scene.add(
        rimLight
    );
}


/* =========================================================
   ANATOMICAL EYE
========================================================= */

function createAnatomicalEye() {

    OculoApp.eye =
        OculoEye.createEye();

    OculoEye.buildAdvancedAnatomy(
        OculoApp.eye
    );

    OculoApp.scene.add(
        OculoApp.eye
    );

}


/* =========================================================
   POINTER CONTROLS
========================================================= */

function createControls() {

    const canvas =
        OculoApp.renderer.domElement;


    canvas.addEventListener(
        "pointerdown",
        pointerDown
    );


    canvas.addEventListener(
        "pointermove",
        pointerMove
    );


    canvas.addEventListener(
        "pointerup",
        pointerUp
    );


    canvas.addEventListener(
        "pointercancel",
        pointerCancel
    );


    canvas.addEventListener(
        "wheel",
        wheelZoom,
        {
            passive: true
        }
    );


    /* -------------------------
       TOUCH PINCH
    ------------------------- */

    let previousPinchDistance = null;


    canvas.addEventListener(
        "touchmove",
        event => {

            if (
                event.touches.length !== 2
            ) {
                return;
            }


            const a =
                event.touches[0];

            const b =
                event.touches[1];


            const dx =
                a.clientX -
                b.clientX;

            const dy =
                a.clientY -
                b.clientY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                previousPinchDistance !== null
            ) {

                const change =
                    distance -
                    previousPinchDistance;


                OculoApp.targetDistance -=
                    change * 0.012;


                OculoApp.targetDistance =
                    THREE.MathUtils.clamp(
                        OculoApp.targetDistance,
                        4,
                        13
                    );
            }


            previousPinchDistance =
                distance;

        },
        {
            passive: true
        }
    );


    canvas.addEventListener(
        "touchend",
        () => {

            previousPinchDistance =
                null;

        },
        {
            passive: true
        }
    );
}


/* =========================================================
   POINTER DOWN
========================================================= */

function pointerDown(event) {

    OculoApp.dragging =
        true;

    OculoApp.moved =
        false;

    OculoApp.pointer.lastX =
        event.clientX;

    OculoApp.pointer.lastY =
        event.clientY;

    event.currentTarget.setPointerCapture(
        event.pointerId
    );
}


/* =========================================================
   POINTER MOVE
========================================================= */

function pointerMove(event) {

    if (
        !OculoApp.dragging
    ) {
        return;
    }


    const dx =
        event.clientX -
        OculoApp.pointer.lastX;

    const dy =
        event.clientY -
        OculoApp.pointer.lastY;


    if (
        Math.abs(dx) > 2 ||
        Math.abs(dy) > 2
    ) {

        OculoApp.moved =
            true;

    }


    OculoApp.targetRotation.y +=
        dx * 0.007;


    OculoApp.targetRotation.x +=
        dy * 0.007;


    OculoApp.targetRotation.x =
        THREE.MathUtils.clamp(
            OculoApp.targetRotation.x,
            -0.9,
            0.9
        );


    OculoApp.pointer.lastX =
        event.clientX;

    OculoApp.pointer.lastY =
        event.clientY;
}


/* =========================================================
   POINTER UP
========================================================= */

function pointerUp(event) {

    const wasMoved =
        OculoApp.moved;

    OculoApp.dragging =
        false;


    if (!wasMoved) {

        selectAnatomy(
            event.clientX,
            event.clientY
        );

    }
}


/* =========================================================
   POINTER CANCEL
========================================================= */

function pointerCancel() {

    OculoApp.dragging =
        false;

}


/* =========================================================
   ZOOM
========================================================= */

function wheelZoom(event) {

    OculoApp.targetDistance +=
        event.deltaY * 0.008;


    OculoApp.targetDistance =
        THREE.MathUtils.clamp(
            OculoApp.targetDistance,
            4,
            13
        );
}


/* =========================================================
   ANATOMICAL SELECTION
========================================================= */

function selectAnatomy(
    clientX,
    clientY
) {

    const rect =
        OculoApp.renderer
            .domElement
            .getBoundingClientRect();


    OculoApp.pointer.x =
        (
            (clientX - rect.left)
            / rect.width
        ) * 2 - 1;


    OculoApp.pointer.y =
        -(
            (clientY - rect.top)
            / rect.height
        ) * 2 + 1;


    OculoApp.raycaster.setFromCamera(
        OculoApp.pointer,
        OculoApp.camera
    );


    const intersections =
        OculoApp.raycaster.intersectObject(
            OculoApp.eye,
            true
        );


    if (
        intersections.length === 0
    ) {
        return;
    }


    let object =
        intersections[0].object;


    while (
        object &&
        object !== OculoApp.eye
    ) {

        if (
            object.name
        ) {

            showAnatomicalInfo(
                object.name
            );

            highlightObject(
                object
            );

            return;
        }


        object =
            object.parent;
    }
}


/* =========================================================
   HIGHLIGHT
========================================================= */

function highlightObject(
    object
) {

    if (
        !object.material ||
        !object.material.emissive
    ) {
        return;
    }


    const material =
        object.material;


    const original =
        material.emissive.clone();


    material.emissive.set(
        0x226b88
    );


    setTimeout(
        () => {

            material.emissive.copy(
                original
            );

        },
        500
    );
}


/* =========================================================
   INFORMATION SYSTEM
========================================================= */

const anatomyDatabase = {

    "Sclera": {

        title: "Sclera",

        text:
        "The opaque posterior five-sixths " +
        "of the fibrous coat of the eyeball."

    },


    "Cornea": {

        title: "Cornea",

        text:
        "The transparent anterior portion " +
        "of the fibrous coat. It provides " +
        "a major part of the eye's refractive power."

    },


    "Iris": {

        title: "Iris",

        text:
        "The contractile pigmented diaphragm " +
        "that controls the diameter of the pupil."

    },


    "Pupil": {

        title: "Pupil",

        text:
        "The central aperture of the iris through " +
        "which light enters the eye."

    },


    "Lens": {

        title: "Lens",

        text:
        "A transparent biconvex structure whose " +
        "curvature changes during accommodation."

    },


    "Vitreous": {

        title: "Vitreous",

        text:
        "A transparent gel filling the large " +
        "posterior cavity behind the lens."

    },


    "Retina": {

        title: "Retina",

        text:
        "The neural coat of the eye containing " +
        "photoreceptors and the retinal neural circuitry."

    },


    "Choroid": {

        title: "Choroid",

        text:
        "The vascular pigmented layer between " +
        "the retina and sclera."

    },


    "Ciliary Body": {

        title: "Ciliary Body",

        text:
        "A structure involved in aqueous humour " +
        "production and accommodation."

    },


    "Zonular Fibres": {

        title: "Zonular Fibres",

        text:
        "Suspensory fibres connecting the ciliary " +
        "body with the lens capsule."

    },


    "Optic Nerve": {

        title: "Optic Nerve",

        text:
        "Cranial nerve II carrying retinal visual " +
        "information toward the brain."

    },


    "Optic Disc": {

        title: "Optic Disc",

        text:
        "The point where retinal ganglion cell " +
        "axons leave the eye to form the optic nerve."

    },


    "Fovea": {

        title: "Fovea",

        text:
        "A specialized central retinal region " +
        "associated with the highest visual acuity."

    },


    "Extraocular Muscle": {

        title: "Extraocular Muscle",

        text:
        "Muscles responsible for coordinated " +
        "movement of the eyeball."

    }

};


/* =========================================================
   SHOW INFORMATION
========================================================= */

function showAnatomicalInfo(
    name
) {

    const data =
        anatomyDatabase[name];


    if (!data) {
        return;
    }


    const title =
        document.getElementById(
            "infoTitle"
        );

    const text =
        document.getElementById(
            "infoText"
        );


    if (title) {
        title.textContent =
            data.title;
    }


    if (text) {
        text.textContent =
            data.text;
    }
}


/* =========================================================
   INTERFACE
========================================================= */

function createInterface() {

    document
        .querySelectorAll(
            ".anatomy-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".anatomy-button"
                        )
                        .forEach(
                            item =>
                            item.classList
                                .remove(
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

        });
}


/* =========================================================
   ANATOMICAL VIEWS
========================================================= */

function changeAnatomicalView(
    view
) {

    const a =
        OculoEye.anatomy;


    /* Reset */

    a.sclera.visible = true;
    a.cornea.visible = true;
    a.iris.visible = true;
    a.pupil.visible = true;
    a.lens.visible = true;
    a.vitreous.visible = true;
    a.retina.visible = true;
    a.choroid.visible = true;
    a.ciliaryBody.visible = true;
    a.zonules.visible = true;
    a.retinalLandmarks.visible = true;


    OculoApp.muscles =
        OculoApp.muscles ||
        null;


    switch(view){

        case "complete":

            showAnatomicalInfo(
                "Sclera"
            );

            break;


        case "anterior":

            a.retina.visible = false;
            a.choroid.visible = false;

            a.vitreous.visible = false;

            showAnatomicalInfo(
                "Cornea"
            );

            break;


        case "posterior":

            a.cornea.visible = false;
            a.iris.visible = false;
            a.pupil.visible = false;
            a.lens.visible = false;
            a.ciliaryBody.visible = false;
            a.zonules.visible = false;

            showAnatomicalInfo(
                "Retina"
            );

            break;


        case "optic":

            showAnatomicalInfo(
                "Optic Nerve"
            );

            break;


        case "muscles":

            showAnatomicalInfo(
                "Extraocular Muscle"
            );

            break;
    }
}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animate(){

    requestAnimationFrame(
        animate
    );


    /* Smooth rotation */

    OculoApp.rotation.x +=
        (
            OculoApp.targetRotation.x -
            OculoApp.rotation.x
        ) * 0.08;


    OculoApp.rotation.y +=
        (
            OculoApp.targetRotation.y -
            OculoApp.rotation.y
        ) * 0.08;


    /* Smooth zoom */

    OculoApp.cameraDistance +=
        (
            OculoApp.targetDistance -
            OculoApp.cameraDistance
        ) * 0.08;


    /* Apply */

    OculoApp.eye.rotation.x =
        OculoApp.rotation.x;


    OculoApp.eye.rotation.y =
        OculoApp.rotation.y;


    OculoApp.camera.position.z =
        OculoApp.cameraDistance;


    OculoApp.camera.lookAt(
        0,
        0,
        0
    );


    /* Subtle corneal animation */

    if (
        OculoEye.anatomy.cornea
    ) {

        const time =
            OculoApp.clock
                .getElapsedTime();


        OculoEye
            .anatomy
            .cornea
            .material
            .opacity =
                .18 +
                Math.sin(
                    time * 1.2
                ) * .015;
    }


    OculoApp.renderer.render(
        OculoApp.scene,
        OculoApp.camera
    );
}


/* =========================================================
   RESIZE
========================================================= */

function resizeRenderer(){

    OculoApp.camera.aspect =
        window.innerWidth /
        window.innerHeight;


    OculoApp.camera.updateProjectionMatrix();


    OculoApp.renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    OculoApp.renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            1.8
        )
    );
}


/* =========================================================
   BOOT
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startOculo3D
    );

} else {

    startOculo3D();

}