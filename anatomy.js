/*
===========================================================
OCULO3D — ADVANCED ANATOMY MODULE
===========================================================
Responsible for structures that sit beyond the basic globe:
• Optic nerve
• Extraocular muscles
• Muscle tendons
• Anatomical helpers
===========================================================
*/

window.OculoAnatomy = (() => {

    const structures = {};

    // -----------------------------------------------------
    // MATERIAL HELPERS
    // -----------------------------------------------------

    function material(color, opacity = 1) {

        return new THREE.MeshStandardMaterial({
            color,
            roughness: 0.65,
            metalness: 0.05,
            transparent: opacity < 1,
            opacity
        });

    }


    // -----------------------------------------------------
    // OPTIC NERVE
    // -----------------------------------------------------

    function createOpticNerve() {

        const group = new THREE.Group();
        group.name = "Optic Nerve";

        const curve = new THREE.CatmullRomCurve3([

            new THREE.Vector3(0, 0, -2.0),
            new THREE.Vector3(0.05, 0.02, -2.45),
            new THREE.Vector3(0.12, 0.06, -2.9),
            new THREE.Vector3(0.28, 0.12, -3.35),
            new THREE.Vector3(0.48, 0.18, -3.75)

        ]);

        const geometry = new THREE.TubeGeometry(
            curve,
            32,
            0.34,
            16,
            false
        );

        const nerve = new THREE.Mesh(
            geometry,
            material(0xf0c58c)
        );

        nerve.name = "Optic Nerve";

        group.add(nerve);

        structures.opticNerve = group;

        return group;
    }


    // -----------------------------------------------------
    // EXTRAOCULAR MUSCLE
    // -----------------------------------------------------

    function createMuscle(
        name,
        color,
        points,
        radius = 0.13
    ) {

        const curve = new THREE.CatmullRomCurve3(points);

        const geometry = new THREE.TubeGeometry(
            curve,
            24,
            radius,
            12,
            false
        );

        const mesh = new THREE.Mesh(
            geometry,
            material(color)
        );

        mesh.name = name;

        structures[name] = mesh;

        return mesh;
    }


    // -----------------------------------------------------
    // EXTRAOCULAR MUSCLES
    // -----------------------------------------------------

    function createExtraocularMuscles() {

        const group = new THREE.Group();

        group.name = "Extraocular Muscles";


        /*
        -----------------------------------------------
        Superior Rectus
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Superior Rectus",
                0xd85c5c,
                [
                    new THREE.Vector3(-0.15, 1.55, 0.05),
                    new THREE.Vector3(-0.12, 1.9, 0.45),
                    new THREE.Vector3(-0.08, 2.25, 0.85)
                ]
            )

        );


        /*
        -----------------------------------------------
        Inferior Rectus
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Inferior Rectus",
                0xc94f4f,
                [
                    new THREE.Vector3(-0.15, -1.55, 0.05),
                    new THREE.Vector3(-0.12, -1.9, 0.45),
                    new THREE.Vector3(-0.08, -2.25, 0.85)
                ]
            )

        );


        /*
        -----------------------------------------------
        Medial Rectus
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Medial Rectus",
                0xd76b6b,
                [
                    new THREE.Vector3(-1.55, 0, 0.05),
                    new THREE.Vector3(-1.9, 0.02, 0.4),
                    new THREE.Vector3(-2.25, 0.05, 0.8)
                ]
            )

        );


        /*
        -----------------------------------------------
        Lateral Rectus
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Lateral Rectus",
                0xc94f4f,
                [
                    new THREE.Vector3(1.55, 0, 0.05),
                    new THREE.Vector3(1.9, 0.02, 0.4),
                    new THREE.Vector3(2.25, 0.05, 0.8)
                ]
            )

        );


        /*
        -----------------------------------------------
        Superior Oblique
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Superior Oblique",
                0xb94747,
                [
                    new THREE.Vector3(0.55, 1.35, 0),
                    new THREE.Vector3(0.85, 1.8, 0.25),
                    new THREE.Vector3(1.25, 2.0, 0.6)
                ],
                0.11
            )

        );


        /*
        -----------------------------------------------
        Inferior Oblique
        -----------------------------------------------
        */

        group.add(

            createMuscle(
                "Inferior Oblique",
                0xb94747,
                [
                    new THREE.Vector3(0.65, -1.3, 0),
                    new THREE.Vector3(1.05, -1.65, 0.3),
                    new THREE.Vector3(1.5, -1.45, 0.7)
                ],
                0.11
            )

        );


        structures.extraocularMuscles = group;

        return group;
    }


    // -----------------------------------------------------
    // COMPLETE ANATOMY
    // -----------------------------------------------------

    function buildAnatomy(parent) {

        const opticNerve = createOpticNerve();

        const muscles = createExtraocularMuscles();


        parent.add(opticNerve);
        parent.add(muscles);


        /*
        Start hidden.

        They will be displayed when the user selects
        the appropriate anatomical view.
        */

        opticNerve.visible = false;
        muscles.visible = false;


        return {
            opticNerve,
            muscles
        };
    }


    // -----------------------------------------------------
    // PUBLIC API
    // -----------------------------------------------------

    return {

        structures,

        createOpticNerve,
        createExtraocularMuscles,
        buildAnatomy

    };

})();