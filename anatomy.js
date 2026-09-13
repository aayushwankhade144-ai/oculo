/*
===========================================================
OCULO3D — ADVANCED ANATOMY ENGINE
===========================================================
External / posterior ocular anatomy

Includes:
• Optic nerve
• Optic chiasm
• Optic tract
• Superior rectus
• Inferior rectus
• Medial rectus
• Lateral rectus
• Superior oblique
• Inferior oblique
• Muscle tendons
===========================================================
*/

"use strict";

window.OculoAnatomy = (() => {

    const structures = {};


    // =====================================================
    // MATERIAL SYSTEM
    // =====================================================

    function createMaterial(
        color,
        options = {}
    ) {

        return new THREE.MeshStandardMaterial({

            color: color,

            roughness:
                options.roughness ?? 0.6,

            metalness:
                options.metalness ?? 0.05,

            transparent:
                options.transparent ?? false,

            opacity:
                options.opacity ?? 1

        });

    }


    // =====================================================
    // TUBE BUILDER
    // =====================================================

    function createTube(
        name,
        points,
        radius,
        color
    ) {

        const curve =
            new THREE.CatmullRomCurve3(
                points
            );

        const geometry =
            new THREE.TubeGeometry(
                curve,
                32,
                radius,
                16,
                false
            );

        const mesh =
            new THREE.Mesh(
                geometry,
                createMaterial(color)
            );

        mesh.name = name;

        return mesh;

    }


    // =====================================================
    // OPTIC NERVE
    // =====================================================

    function createOpticNerve() {

        const group =
            new THREE.Group();

        group.name =
            "Optic Nerve";


        /*
        The eye's posterior pole is toward -Z.

        The nerve therefore begins behind the globe
        and travels posteriorly rather than through
        the anterior surface.
        */

        const nervePoints = [

            new THREE.Vector3(
                0,
                0,
                -2.05
            ),

            new THREE.Vector3(
                0.02,
                0.01,
                -2.35
            ),

            new THREE.Vector3(
                0.08,
                0.02,
                -2.70
            ),

            new THREE.Vector3(
                0.18,
                0.04,
                -3.05
            ),

            new THREE.Vector3(
                0.32,
                0.08,
                -3.35
            ),

            new THREE.Vector3(
                0.48,
                0.12,
                -3.65
            )

        ];


        const nerve =
            createTube(
                "Optic Nerve",
                nervePoints,
                0.30,
                0xe4b47e
            );


        group.add(nerve);

        structures.opticNerve =
            group;

        return group;

    }


    // =====================================================
    // OPTIC CHIASM + TRACTS
    // =====================================================

    function createOpticPathway() {

        const group =
            new THREE.Group();

        group.name =
            "Optic Pathway";


        /*
        Left optic tract
        */

        const leftTract =
            createTube(
                "Left Optic Tract",
                [

                    new THREE.Vector3(
                        -0.05,
                        0,
                        -3.0
                    ),

                    new THREE.Vector3(
                        -0.45,
                        0.02,
                        -3.45
                    ),

                    new THREE.Vector3(
                        -0.85,
                        0.05,
                        -3.75
                    )

                ],
                0.18,
                0xd8a66f
            );


        /*
        Right optic tract
        */

        const rightTract =
            createTube(
                "Right Optic Tract",
                [

                    new THREE.Vector3(
                        0.05,
                        0,
                        -3.0
                    ),

                    new THREE.Vector3(
                        0.45,
                        0.02,
                        -3.45
                    ),

                    new THREE.Vector3(
                        0.85,
                        0.05,
                        -3.75
                    )

                ],
                0.18,
                0xd8a66f
            );


        /*
        Chiasm
        */

        const chiasm =
            createTube(
                "Optic Chiasm",
                [

                    new THREE.Vector3(
                        -0.38,
                        0,
                        -3.15
                    ),

                    new THREE.Vector3(
                        0,
                        0,
                        -3.35
                    ),

                    new THREE.Vector3(
                        0.38,
                        0,
                        -3.15
                    )

                ],
                0.22,
                0xf0c48b
            );


        group.add(leftTract);
        group.add(rightTract);
        group.add(chiasm);

        structures.opticPathway =
            group;

        return group;

    }


    // =====================================================
    // MUSCLE CREATOR
    // =====================================================

    function createMuscle(
        name,
        points,
        color = 0xc95757,
        radius = 0.14
    ) {

        const muscle =
            createTube(
                name,
                points,
                radius,
                color
            );

        structures[name] =
            muscle;

        return muscle;

    }


    // =====================================================
    // EXTRAOCULAR MUSCLES
    // =====================================================

    function createExtraocularMuscles() {

        const group =
            new THREE.Group();

        group.name =
            "Extraocular Muscles";


        // -------------------------------------------------
        // SUPERIOR RECTUS
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Superior Rectus",

                [

                    new THREE.Vector3(
                        -0.65,
                        1.45,
                        0.10
                    ),

                    new THREE.Vector3(
                        -0.45,
                        2.00,
                        -0.20
                    ),

                    new THREE.Vector3(
                        -0.25,
                        2.35,
                        -0.75
                    )

                ],

                0xd65a5a,
                0.15
            )

        );


        // -------------------------------------------------
        // INFERIOR RECTUS
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Inferior Rectus",

                [

                    new THREE.Vector3(
                        -0.65,
                        -1.45,
                        0.10
                    ),

                    new THREE.Vector3(
                        -0.45,
                        -2.00,
                        -0.20
                    ),

                    new THREE.Vector3(
                        -0.25,
                        -2.35,
                        -0.75
                    )

                ],

                0xc94d4d,
                0.15
            )

        );


        // -------------------------------------------------
        // MEDIAL RECTUS
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Medial Rectus",

                [

                    new THREE.Vector3(
                        -1.45,
                        0.55,
                        0.10
                    ),

                    new THREE.Vector3(
                        -2.00,
                        0.40,
                        -0.20
                    ),

                    new THREE.Vector3(
                        -2.40,
                        0.25,
                        -0.70
                    )

                ],

                0xd95b5b,
                0.15
            )

        );


        // -------------------------------------------------
        // LATERAL RECTUS
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Lateral Rectus",

                [

                    new THREE.Vector3(
                        1.45,
                        0.55,
                        0.10
                    ),

                    new THREE.Vector3(
                        2.00,
                        0.40,
                        -0.20
                    ),

                    new THREE.Vector3(
                        2.40,
                        0.25,
                        -0.70
                    )

                ],

                0xc94d4d,
                0.15
            )

        );


        // -------------------------------------------------
        // SUPERIOR OBLIQUE
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Superior Oblique",

                [

                    new THREE.Vector3(
                        0.55,
                        1.20,
                        0.10
                    ),

                    new THREE.Vector3(
                        0.95,
                        1.65,
                        -0.10
                    ),

                    new THREE.Vector3(
                        1.35,
                        1.85,
                        -0.55
                    )

                ],

                0xb84242,
                0.11
            )

        );


        // -------------------------------------------------
        // INFERIOR OBLIQUE
        // -------------------------------------------------

        group.add(

            createMuscle(
                "Inferior Oblique",

                [

                    new THREE.Vector3(
                        0.55,
                        -1.20,
                        0.10
                    ),

                    new THREE.Vector3(
                        0.95,
                        -1.65,
                        -0.10
                    ),

                    new THREE.Vector3(
                        1.35,
                        -1.85,
                        -0.55
                    )

                ],

                0xb84242,
                0.11
            )

        );


        structures.extraocularMuscles =
            group;


        return group;

    }


    // =====================================================
    // BUILD COMPLETE EXTERNAL ANATOMY
    // =====================================================

    function buildAnatomy(parent) {

        const opticNerve =
            createOpticNerve();

        const opticPathway =
            createOpticPathway();

        const muscles =
            createExtraocularMuscles();


        parent.add(
            opticNerve
        );

        parent.add(
            opticPathway
        );

        parent.add(
            muscles
        );


        /*
        Everything starts hidden.

        Main.js decides which anatomical
        view should expose it.
        */

        opticNerve.visible =
            false;

        opticPathway.visible =
            false;

        muscles.visible =
            false;


        return {

            opticNerve,

            opticPathway,

            muscles

        };

    }


    // =====================================================
    // PUBLIC API
    // =====================================================

    return {

        structures,

        createOpticNerve,

        createOpticPathway,

        createExtraocularMuscles,

        buildAnatomy

    };

})();
