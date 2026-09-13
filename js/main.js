/*
===========================================================
OCULO3D — MAIN APPLICATION ENGINE
===========================================================
Controls:
• Scene
• Camera
• Renderer
• Lighting
• Eye
• Advanced anatomy
• Touch / mouse interaction
• Anatomical views
• Structure selection
===========================================================
*/

window.OculoApp = (() => {

    const App = {

        scene: null,
        camera: null,
        renderer: null,

        eye: null,
        anatomy: null,

        raycaster: null,
        pointer: new THREE.Vector2(),

        selectedObject: null,

        isDragging: false,
        previousPointer: {
            x: 0,
            y: 0
        },

        pinchDistance: null,

        zoom: 6,

        activeView: "complete"

    };


    // =====================================================
    // START APPLICATION
    // =====================================================

    function startOculo3D() {

        createScene();
        createCamera();
        createRenderer();
        createLighting();

        createAnatomicalEye();
        createAdvancedAnatomy();

        createInteraction();

        createInterface();

        animate();

        window.addEventListener(
            "resize",
            resizeRenderer
        );
    }


    // =====================================================
    // SCENE
    // =====================================================

    function createScene() {

        App.scene = new THREE.Scene();

        App.scene.background =
            new THREE.Color(0x03070b);

    }


    // =====================================================
    // CAMERA
    // =====================================================

    function createCamera() {

        const width = window.innerWidth;
        const height = window.innerHeight;

        App.camera = new THREE.PerspectiveCamera(
            42,
            width / height,
            0.1,
            100
        );

        App.camera.position.set(
            0,
            0,
            App.zoom
        );

        App.camera.lookAt(0, 0, 0);

    }


    // =====================================================
    // RENDERER
    // =====================================================

    function createRenderer() {

        App.renderer =
            new THREE.WebGLRenderer({

                antialias: true,
                alpha: false,
                powerPreference: "high-performance"

            });

        App.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        App.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        App.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        App.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        App.renderer.toneMappingExposure = 1.05;

        document
            .getElementById("app")
            .appendChild(App.renderer.domElement);

    }


    // =====================================================
    // LIGHTING
    // =====================================================

    function createLighting() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.7
            );

        App.scene.add(ambient);


        const key =
            new THREE.DirectionalLight(
                0xffffff,
                2.4
            );

        key.position.set(
            4,
            5,
            6
        );

        App.scene.add(key);


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

        App.scene.add(fill);


        const rim =
            new THREE.DirectionalLight(
                0x5577ff,
                1.5
            );

        rim.position.set(
            0,
            -4,
            -6
        );

        App.scene.add(rim);

    }


    // =====================================================
    // BASIC EYE
    // =====================================================

    function createAnatomicalEye() {

        App.eye =
            OculoEye.createEye();

        App.scene.add(App.eye);

        OculoEye.buildAdvancedAnatomy(
            App.eye
        );

    }


    // =====================================================
    // ADVANCED EXTERNAL ANATOMY
    // =====================================================

    function createAdvancedAnatomy() {

        if (!window.OculoAnatomy) {
            console.warn(
                "OculoAnatomy module not loaded."
            );

            return;
        }

        App.anatomy =
            OculoAnatomy.buildAnatomy(
                App.eye
            );

    }


    // =====================================================
    // INTERACTION SYSTEM
    // =====================================================

    function createInteraction() {

        App.raycaster =
            new THREE.Raycaster();


        const canvas =
            App.renderer.domElement;


        // -------------------------------------------------
        // POINTER DOWN
        // -------------------------------------------------

        canvas.addEventListener(
            "pointerdown",
            pointerDown
        );


        // -------------------------------------------------
        // POINTER MOVE
        // -------------------------------------------------

        canvas.addEventListener(
            "pointermove",
            pointerMove
        );


        // -------------------------------------------------
        // POINTER UP
        // -------------------------------------------------

        canvas.addEventListener(
            "pointerup",
            pointerUp
        );


        canvas.addEventListener(
            "pointercancel",
            pointerUp
        );


        // -------------------------------------------------
        // WHEEL ZOOM
        // -------------------------------------------------

        canvas.addEventListener(
            "wheel",
            wheelZoom,
            { passive: false }
        );


        // -------------------------------------------------
        // TOUCH
        // -------------------------------------------------

        canvas.addEventListener(
            "touchstart",
            touchStart,
            { passive: false }
        );

        canvas.addEventListener(
            "touchmove",
            touchMove,
            { passive: false }
        );

        canvas.addEventListener(
            "touchend",
            touchEnd,
            { passive: false }
        );

    }


    // =====================================================
    // POINTER DOWN
    // =====================================================

    function pointerDown(event) {

        App.isDragging = true;

        App.previousPointer.x =
            event.clientX;

        App.previousPointer.y =
            event.clientY;

    }


    // =====================================================
    // POINTER MOVE
    // =====================================================

    function pointerMove(event) {

        if (!App.isDragging) return;

        const dx =
            event.clientX -
            App.previousPointer.x;

        const dy =
            event.clientY -
            App.previousPointer.y;


        App.eye.rotation.y +=
            dx * 0.008;

        App.eye.rotation.x +=
            dy * 0.008;


        App.eye.rotation.x =
            THREE.MathUtils.clamp(
                App.eye.rotation.x,
                -1.2,
                1.2
            );


        App.previousPointer.x =
            event.clientX;

        App.previousPointer.y =
            event.clientY;

    }


    // =====================================================
    // POINTER UP
    // =====================================================

    function pointerUp(event) {

        if (!App.isDragging) return;

        App.isDragging = false;


        // If the pointer barely moved,
        // treat it as a tap/click.

        const distance =
            Math.hypot(
                event.clientX -
                App.previousPointer.x,

                event.clientY -
                App.previousPointer.y
            );

        if (distance < 8) {

            selectAnatomy(
                event.clientX,
                event.clientY
            );

        }

    }


    // =====================================================
    // WHEEL ZOOM
    // =====================================================

    function wheelZoom(event) {

        event.preventDefault();

        App.zoom +=
            event.deltaY * 0.0025;

        App.zoom =
            THREE.MathUtils.clamp(
                App.zoom,
                3.4,
                10
            );

        App.camera.position.z =
            App.zoom;

    }


    // =====================================================
    // TOUCH START
    // =====================================================

    function touchStart(event) {

        if (event.touches.length === 2) {

            App.pinchDistance =
                getTouchDistance(event);

        }

    }


    // =====================================================
    // TOUCH MOVE
    // =====================================================

    function touchMove(event) {

        if (event.touches.length !== 2) {
            return;
        }

        event.preventDefault();

        const distance =
            getTouchDistance(event);

        if (App.pinchDistance === null) {

            App.pinchDistance =
                distance;

            return;

        }


        const difference =
            App.pinchDistance -
            distance;


        App.zoom +=
            difference * 0.01;


        App.zoom =
            THREE.MathUtils.clamp(
                App.zoom,
                3.4,
                10
            );


        App.camera.position.z =
            App.zoom;


        App.pinchDistance =
            distance;

    }


    // =====================================================
    // TOUCH END
    // =====================================================

    function touchEnd() {

        App.pinchDistance = null;

    }


    // =====================================================
    // TOUCH DISTANCE
    // =====================================================

    function getTouchDistance(event) {

        const a =
            event.touches[0];

        const b =
            event.touches[1];

        return Math.hypot(
            a.clientX - b.clientX,
            a.clientY - b.clientY
        );

    }


    // =====================================================
    // ANATOMICAL SELECTION
    // =====================================================

    function selectAnatomy(x, y) {

        const rect =
            App.renderer.domElement
                .getBoundingClientRect();


        App.pointer.x =
            ((x - rect.left) /
                rect.width) * 2 - 1;

        App.pointer.y =
            -((y - rect.top) /
                rect.height) * 2 + 1;


        App.raycaster.setFromCamera(
            App.pointer,
            App.camera
        );


        const objects =
            App.scene.children.filter(
                object =>
                    object !== App.camera
            );


        const intersections =
            App.raycaster.intersectObjects(
                objects,
                true
            );


        if (
            intersections.length === 0
        ) {

            clearSelection();

            return;
        }


        const object =
            findSelectableObject(
                intersections[0].object
            );


        if (!object) return;

        highlightObject(object);

        showAnatomicalInfo(
            object.name
        );

    }


    // =====================================================
    // FIND SELECTABLE STRUCTURE
    // =====================================================

    function findSelectableObject(object) {

        let current = object;

        while (
            current &&
            current !== App.scene
        ) {

            if (
                current.name &&
                current.name !== ""
            ) {

                return current;

            }

            current =
                current.parent;
        }

        return null;

    }


    // =====================================================
    // HIGHLIGHT
    // =====================================================

    function highlightObject(object) {

        clearSelection();

        App.selectedObject =
            object;


        if (
            object.material &&
            "emissive" in object.material
        ) {

            object.userData.originalEmissive =
                object.material.emissive.clone();

            object.userData.originalIntensity =
                object.material.emissiveIntensity;

            object.material.emissive.set(
                0x63d8ff
            );

            object.material.emissiveIntensity =
                0.65;

        }

    }


    // =====================================================
    // CLEAR SELECTION
    // =====================================================

    function clearSelection() {

        if (
            !App.selectedObject
        ) return;


        const material =
            App.selectedObject.material;


        if (
            material &&
            "emissive" in material &&
            App.selectedObject.userData
                .originalEmissive
        ) {

            material.emissive.copy(
                App.selectedObject.userData
                    .originalEmissive
            );

            material.emissiveIntensity =
                App.selectedObject.userData
                    .originalIntensity;

        }


        App.selectedObject = null;

    }


    // =====================================================
    // ANATOMY DATABASE
    // =====================================================

    const anatomyDatabase = {

        "Sclera": {
            title: "Sclera",
            text:
                "The tough fibrous outer coat of the eyeball. It maintains the shape of the globe and provides attachment for the extraocular muscles."
        },

        "Cornea": {
            title: "Cornea",
            text:
                "The transparent anterior portion of the fibrous coat. It provides a major portion of the eye's refractive power."
        },

        "Iris": {
            title: "Iris",
            text:
                "The pigmented diaphragm surrounding the pupil. It regulates the amount of light entering the eye."
        },

        "Pupil": {
            title: "Pupil",
            text:
                "The central aperture of the iris through which light enters the eye."
        },

        "Lens": {
            title: "Lens",
            text:
                "A transparent biconvex structure behind the iris. Its curvature changes during accommodation to focus near objects."
        },

        "Vitreous": {
            title: "Vitreous Body",
            text:
                "A transparent gel filling most of the posterior segment. It helps maintain the shape of the globe and supports the retina."
        },

        "Retina": {
            title: "Retina",
            text:
                "The neurosensory layer of the eye containing photoreceptors and neural circuits responsible for converting light into electrical signals."
        },

        "Choroid": {
            title: "Choroid",
            text:
                "A vascular pigmented layer between the retina and sclera that supplies the outer retina and absorbs stray light."
        },

        "Ciliary Body": {
            title: "Ciliary Body",
            text:
                "A ring-shaped structure involved in aqueous humor production and accommodation."
        },

        "Zonular Fibres": {
            title: "Zonular Fibres",
            text:
                "Suspensory fibres connecting the ciliary body to the lens. Changes in their tension alter lens curvature during accommodation."
        },

        "Optic Nerve": {
            title: "Optic Nerve",
            text:
                "Cranial nerve II carries visual information from retinal ganglion cells toward the optic chiasm and the brain."
        },

        "Superior Rectus": {
            title: "Superior Rectus",
            text:
                "An extraocular muscle primarily responsible for elevation of the eye, with additional intorsion and adduction effects."
        },

        "Inferior Rectus": {
            title: "Inferior Rectus",
            text:
                "An extraocular muscle primarily responsible for depression, with additional extorsion and adduction effects."
        },

        "Medial Rectus": {
            title: "Medial Rectus",
            text:
                "The primary adductor of the eyeball."
        },

        "Lateral Rectus": {
            title: "Lateral Rectus",
            text:
                "The primary abductor of the eyeball and is supplied by cranial nerve VI."
        },

        "Superior Oblique": {
            title: "Superior Oblique",
            text:
                "An extraocular muscle that primarily intorts the eye, with additional depression and abduction."
        },

        "Inferior Oblique": {
            title: "Inferior Oblique",
            text:
                "An extraocular muscle that primarily extorts the eye, with additional elevation and abduction."
        },

        "Optic Disc": {
            title: "Optic Disc",
            text:
                "The point where retinal ganglion cell axons leave the eye to form the optic nerve. It contains no photoreceptors and therefore corresponds to the physiological blind spot."
        },

        "Fovea": {
            title: "Fovea",
            text:
                "A specialized region of the macula with the highest density of cones and the finest spatial visual acuity."
        }

    };


    // =====================================================
    // SHOW INFORMATION
    // =====================================================

    function showAnatomicalInfo(name) {

        const data =
            anatomyDatabase[name];


        if (!data) {

            document
                .getElementById("infoTitle")
                .textContent =
                    name || "Ocular Structure";

            document
                .getElementById("infoText")
                .textContent =
                    "Detailed anatomical information will be added to this structure.";

            return;
        }


        document
            .getElementById("infoTitle")
            .textContent =
                data.title;


        document
            .getElementById("infoText")
            .textContent =
                data.text;

    }


    // =====================================================
    // INTERFACE
    // =====================================================

    function createInterface() {

        const buttons =
            document.querySelectorAll(
                ".anatomy-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const view =
                        button.dataset.view;

                    changeAnatomicalView(
                        view
                    );


                    buttons.forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );

                }
            );

        });

    }


    // =====================================================
    // ANATOMICAL VIEWS
    // =====================================================

    function changeAnatomicalView(view) {

        App.activeView =
            view;


        // -------------------------------------------------
        // RESET EVERYTHING
        // -------------------------------------------------

        if (App.anatomy) {

            App.anatomy.opticNerve.visible =
                false;

            App.anatomy.muscles.visible =
                false;

        }


        // Make core eye structures visible again.

        if (App.eye) {

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


        // -------------------------------------------------
        // COMPLETE
        // -------------------------------------------------

        if (view === "complete") {

            if (App.anatomy) {

                App.anatomy.opticNerve.visible =
                    false;

                App.anatomy.muscles.visible =
                    false;

            }

            return;
        }


        // -------------------------------------------------
        // ANTERIOR
        // -------------------------------------------------

        if (view === "anterior") {

            hidePosteriorStructures();

            return;
        }


        // -------------------------------------------------
        // POSTERIOR
        // -------------------------------------------------

        if (view === "posterior") {

            showPosteriorStructures();

            return;
        }


        // -------------------------------------------------
        // OPTIC PATHWAY
        // -------------------------------------------------

        if (view === "optic") {

            if (App.anatomy) {

                App.anatomy.opticNerve.visible =
                    true;

            }

            showAnatomicalInfo(
                "Optic Nerve"
            );

            return;
        }


        // -------------------------------------------------
        // MUSCLES
        // -------------------------------------------------

        if (view === "muscles") {

            if (App.anatomy) {

                App.anatomy.muscles.visible =
                    true;

            }

            showAnatomicalInfo(
                "Extraocular Muscles"
            );

        }

    }


    // =====================================================
    // ANTERIOR VIEW
    // =====================================================

    function hidePosteriorStructures() {

        const hide = [

            "vitreous",
            "retina",
            "choroid"

        ];


        hide.forEach(key => {

            if (
                OculoEye.anatomy[key]
            ) {

                OculoEye.anatomy[key]
                    .visible = false;

            }

        });

    }


    // =====================================================
    // POSTERIOR VIEW
    // =====================================================

    function showPosteriorStructures() {

        const anterior = [

            "cornea",
            "iris",
            "pupil",
            "lens"

        ];


        anterior.forEach(key => {

            if (
                OculoEye.anatomy[key]
            ) {

                OculoEye.anatomy[key]
                    .visible = false;

            }

        });

    }


    // =====================================================
    // ANIMATION
    // =====================================================

    function animate() {

        requestAnimationFrame(
            animate
        );


        if (App.eye) {

            App.eye.rotation.z +=
                0.00015;

        }


        App.renderer.render(
            App.scene,
            App.camera
        );

    }


    // =====================================================
    // RESIZE
    // =====================================================

    function resizeRenderer() {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        App.camera.aspect =
            width / height;


        App.camera.updateProjectionMatrix();


        App.renderer.setSize(
            width,
            height
        );

    }


    // =====================================================
    // START
    // =====================================================

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


    // =====================================================
    // PUBLIC API
    // =====================================================

    return App;

})();