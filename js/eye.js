/* =========================================================
   OCULO3D — EYE ANATOMY MODULE
   Core anatomical geometry
========================================================= */

window.OculoEye = (() => {

    const anatomy = {};

    function createMaterial(color, options = {}) {
        return new THREE.MeshPhysicalMaterial({
            color,
            roughness: options.roughness ?? 0.35,
            metalness: options.metalness ?? 0,
            transparent: options.transparent ?? false,
            opacity: options.opacity ?? 1,
            transmission: options.transmission ?? 0,
            thickness: options.thickness ?? 0,
            side: options.side ?? THREE.FrontSide,
            depthWrite: options.depthWrite ?? true
        });
    }

    /* =====================================================
       MAIN EYE
    ===================================================== */

    function createEye() {

        const eye = new THREE.Group();

        eye.name = "Eyeball";

        /* -------------------------------------------------
           SCLERA
        ------------------------------------------------- */

        const scleraGeometry =
            new THREE.SphereGeometry(
                2.5,
                96,
                64
            );

        const scleraMaterial =
            createMaterial(
                0xe8edf0,
                {
                    roughness: 0.28
                }
            );

        anatomy.sclera =
            new THREE.Mesh(
                scleraGeometry,
                scleraMaterial
            );

        anatomy.sclera.name =
            "Sclera";

        anatomy.sclera.userData.type =
            "fibrous-coat";

        eye.add(
            anatomy.sclera
        );


        /* -------------------------------------------------
           CORNEA
        ------------------------------------------------- */

        const corneaGeometry =
            new THREE.SphereGeometry(
                1.34,
                96,
                64,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );

        const corneaMaterial =
            createMaterial(
                0xdff8ff,
                {
                    roughness: 0.03,
                    transmission: 0.25,
                    thickness: 0.08,
                    transparent: true,
                    opacity: 0.22,
                    depthWrite: false
                }
            );

        anatomy.cornea =
            new THREE.Mesh(
                corneaGeometry,
                corneaMaterial
            );

        anatomy.cornea.name =
            "Cornea";

        anatomy.cornea.position.z =
            2.34;

        anatomy.cornea.rotation.x =
            Math.PI;

        eye.add(
            anatomy.cornea
        );


        /* -------------------------------------------------
           IRIS
        ------------------------------------------------- */

        anatomy.iris =
            createIris();

        eye.add(
            anatomy.iris
        );


        /* -------------------------------------------------
           PUPIL
        ------------------------------------------------- */

        anatomy.pupil =
            createPupil();

        eye.add(
            anatomy.pupil
        );


        /* -------------------------------------------------
           LENS
        ------------------------------------------------- */

        anatomy.lens =
            createLens();

        eye.add(
            anatomy.lens
        );


        /* -------------------------------------------------
           VITREOUS
        ------------------------------------------------- */

        anatomy.vitreous =
            createVitreous();

        eye.add(
            anatomy.vitreous
        );


        /* -------------------------------------------------
           RETINA
        ------------------------------------------------- */

        anatomy.retina =
            createRetina();

        eye.add(
            anatomy.retina
        );


        /* -------------------------------------------------
           CHOROID
        ------------------------------------------------- */

        anatomy.choroid =
            createChoroid();

        eye.add(
            anatomy.choroid
        );


        return eye;
    }


    /* =====================================================
       IRIS
    ===================================================== */

    function createIris() {

        const group =
            new THREE.Group();

        group.name =
            "Iris";

        const geometry =
            new THREE.CircleGeometry(
                1.08,
                96
            );

        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0x356b7d,

                roughness: .4,

                clearcoat: .3,

                clearcoatRoughness: .25,

                side:
                    THREE.DoubleSide
            });

        const iris =
            new THREE.Mesh(
                geometry,
                material
            );

        iris.position.z =
            2.475;

        iris.userData.type =
            "iris";

        group.add(
            iris
        );


        /*
         * Radial iris fibres
         */

        const fibreMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x8ac8d7,
                transparent: true,
                opacity: .22
            });

        for(let i = 0; i < 72; i++) {

            const angle =
                (i / 72) *
                Math.PI *
                2;

            const inner =
                .48;

            const outer =
                .98;

            const points = [

                new THREE.Vector3(
                    Math.cos(angle) * inner,
                    Math.sin(angle) * inner,
                    2.49
                ),

                new THREE.Vector3(
                    Math.cos(angle) * outer,
                    Math.sin(angle) * outer,
                    2.49
                )

            ];

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);

            const line =
                new THREE.Line(
                    geometry,
                    fibreMaterial
                );

            group.add(
                line
            );
        }


        /*
         * Pupillary ruff
         */

        const ruffGeometry =
            new THREE.RingGeometry(
                .44,
                .50,
                96
            );

        const ruffMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x183843,
                side: THREE.DoubleSide
            });

        const ruff =
            new THREE.Mesh(
                ruffGeometry,
                ruffMaterial
            );

        ruff.position.z =
            2.505;

        group.add(
            ruff
        );


        return group;
    }


    /* =====================================================
       PUPIL
    ===================================================== */

    function createPupil() {

        const geometry =
            new THREE.CircleGeometry(
                .46,
                96
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: 0x010204,
                side: THREE.DoubleSide
            });

        const pupil =
            new THREE.Mesh(
                geometry,
                material
            );

        pupil.name =
            "Pupil";

        pupil.position.z =
            2.51;

        pupil.userData.type =
            "pupil";

        return pupil;
    }


    /* =====================================================
       LENS
    ===================================================== */

    function createLens() {

        const geometry =
            new THREE.SphereGeometry(
                .72,
                64,
                48
            );

        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0xd7f4ff,

                roughness: .04,

                transmission: .65,

                thickness: .25,

                transparent: true,

                opacity: .42,

                clearcoat: 1,

                clearcoatRoughness: .03
            });

        const lens =
            new THREE.Mesh(
                geometry,
                material
            );

        lens.name =
            "Lens";

        lens.scale.set(
            1,
            1,
            .48
        );

        lens.position.z =
            1.55;

        lens.userData.type =
            "lens";

        return lens;
    }


    /* =====================================================
       VITREOUS
    ===================================================== */

    function createVitreous() {

        const geometry =
            new THREE.SphereGeometry(
                2.35,
                48,
                32
            );

        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0xd8f5ff,

                transparent: true,

                opacity: .055,

                roughness: .05,

                transmission: .15,

                depthWrite: false
            });

        const vitreous =
            new THREE.Mesh(
                geometry,
                material
            );

        vitreous.name =
            "Vitreous";

        vitreous.userData.type =
            "vitreous";

        return vitreous;
    }


    /* =====================================================
       RETINA
    ===================================================== */

    function createRetina() {

        const geometry =
            new THREE.SphereGeometry(
                2.39,
                64,
                48
            );

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x8b3040,

                side: THREE.BackSide,

                transparent: true,

                opacity: .18,

                depthWrite: false
            });

        const retina =
            new THREE.Mesh(
                geometry,
                material
            );

        retina.name =
            "Retina";

        retina.userData.type =
            "neural-coat";

        return retina;
    }


    /* =====================================================
       CHOROID
    ===================================================== */

    function createChoroid() {

        const geometry =
            new THREE.SphereGeometry(
                2.43,
                64,
                48
            );

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x39151c,

                side: THREE.BackSide,

                transparent: true,

                opacity: .12,

                depthWrite: false
            });

        const choroid =
            new THREE.Mesh(
                geometry,
                material
            );

        choroid.name =
            "Choroid";

        choroid.userData.type =
            "vascular-coat";

        return choroid;
    }


    /* =====================================================
       CILIARY BODY
    ===================================================== */

    function createCiliaryBody() {

        const group =
            new THREE.Group();

        group.name =
            "Ciliary Body";

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x70424c,
                roughness: .7
            });

        for(let i = 0; i < 72; i++) {

            const angle =
                (i / 72) *
                Math.PI *
                2;

            const geometry =
                new THREE.ConeGeometry(
                    .055,
                    .35,
                    8
                );

            const process =
                new THREE.Mesh(
                    geometry,
                    material
                );

            process.position.set(
                Math.cos(angle) * .98,
                Math.sin(angle) * .98,
                1.25
            );

            process.rotation.z =
                -angle;

            group.add(
                process
            );
        }

        return group;
    }


    /* =====================================================
       ZONULAR FIBRES
    ===================================================== */

    function createZonules() {

        const group =
            new THREE.Group();

        group.name =
            "Zonular Fibres";

        const material =
            new THREE.LineBasicMaterial({
                color: 0xc9d9df,
                transparent: true,
                opacity: .55
            });

        for(let i = 0; i < 48; i++) {

            const angle =
                (i / 48) *
                Math.PI *
                2;

            const points = [

                new THREE.Vector3(
                    Math.cos(angle) * 1.0,
                    Math.sin(angle) * 1.0,
                    1.25
                ),

                new THREE.Vector3(
                    Math.cos(angle) * .62,
                    Math.sin(angle) * .62,
                    1.55
                )

            ];

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);

            const line =
                new THREE.Line(
                    geometry,
                    material
                );

            group.add(
                line
            );
        }

        return group;
    }


    /* =====================================================
       RETINAL LANDMARKS
    ===================================================== */

    function createRetinalLandmarks() {

        const group =
            new THREE.Group();

        group.name =
            "Retinal Landmarks";

        /*
         * Optic disc
         */

        const discGeometry =
            new THREE.CircleGeometry(
                .28,
                48
            );

        const discMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xf2d49b,
                side: THREE.DoubleSide
            });

        const disc =
            new THREE.Mesh(
                discGeometry,
                discMaterial
            );

        disc.position.set(
            -2.15,
            0,
            .05
        );

        disc.rotation.y =
            Math.PI / 2;

        disc.name =
            "Optic Disc";

        group.add(
            disc
        );


        /*
         * Fovea
         */

        const foveaGeometry =
            new THREE.CircleGeometry(
                .11,
                32
            );

        const foveaMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x551d28,
                side: THREE.DoubleSide
            });

        const fovea =
            new THREE.Mesh(
                foveaGeometry,
                foveaMaterial
            );

        fovea.position.set(
            1.05,
            0,
            .03
        );

        fovea.rotation.y =
            Math.PI / 2;

        fovea.name =
            "Fovea";

        group.add(
            fovea
        );


        return group;
    }


    /* =====================================================
       FULL ANATOMICAL ASSEMBLY
    ===================================================== */

    function buildAdvancedAnatomy(
        eye
    ) {

        const ciliary =
            createCiliaryBody();

        eye.add(
            ciliary
        );

        anatomy.ciliaryBody =
            ciliary;


        const zonules =
            createZonules();

        eye.add(
            zonules
        );

        anatomy.zonules =
            zonules;


        const landmarks =
            createRetinalLandmarks();

        eye.add(
            landmarks
        );

        anatomy.retinalLandmarks =
            landmarks;

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    return {

        anatomy,

        createEye,

        buildAdvancedAnatomy

    };

})();
