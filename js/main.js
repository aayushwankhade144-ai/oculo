function changeAnatomicalView(view) {

    App.activeView = view;


    // =================================================
    // RESET EYE ORIENTATION
    // =================================================

    if (App.eye) {

        App.eye.rotation.y = 0;
        App.eye.rotation.x = 0;

    }


    // =================================================
    // RESET EXTERNAL ANATOMY
    // =================================================

    if (App.anatomy) {

        App.anatomy.opticNerve.visible = false;

        App.anatomy.opticPathway.visible = false;

        App.anatomy.muscles.visible = false;

    }


    // =================================================
    // RESET CORE ANATOMY
    // =================================================

    Object.values(
        OculoEye.anatomy
    ).forEach(structure => {

        if (
            structure &&
            structure.isObject3D
        ) {

            structure.visible = true;

        }

    });


    // =================================================
    // COMPLETE EYE
    // =================================================

    if (view === "complete") {

        showAnatomicalInfo(
            "Ocular Globe"
        );

        return;
    }


    // =================================================
    // ANTERIOR SEGMENT
    // =================================================

    if (view === "anterior") {

        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");

        showAnatomicalInfo(
            "Cornea"
        );

        return;
    }


    // =================================================
    // POSTERIOR SEGMENT
    // =================================================

    if (view === "posterior") {

        /*
        Rotate the globe so the posterior
        pole faces the camera.
        */

        App.eye.rotation.y =
            Math.PI;


        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");

        if (App.anatomy) {

            App.anatomy.opticNerve.visible =
                true;

        }

        showAnatomicalInfo(
            "Retina"
        );

        return;
    }


    // =================================================
    // OPTIC PATHWAY
    // =================================================

    if (view === "optic") {

        /*
        Turn the eye around so the
        posterior optic nerve faces
        the camera.
        */

        App.eye.rotation.y =
            Math.PI;


        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");


        if (App.anatomy) {

            App.anatomy.opticNerve.visible =
                true;

            App.anatomy.opticPathway.visible =
                true;

        }


        showAnatomicalInfo(
            "Optic Nerve"
        );

        return;
    }


    // =================================================
    // EXTRAOCULAR MUSCLES
    // =================================================

    if (view === "muscles") {

        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");


        if (App.anatomy) {

            App.anatomy.muscles.visible =
                true;

        }


        showAnatomicalInfo(
            "Extraocular Muscles"
        );

    }

}

    App.activeView = view;

    // =================================================
    // RESET EXTERNAL ANATOMY
    // =================================================

    if (App.anatomy) {

        App.anatomy.opticNerve.visible = false;

        App.anatomy.opticPathway.visible = false;

        App.anatomy.muscles.visible = false;
    }


    // =================================================
    // RESET CORE EYE
    // =================================================

    const anatomy =
        OculoEye.anatomy;

    Object.values(anatomy).forEach(
        structure => {

            if (
                structure &&
                structure.isObject3D
            ) {

                structure.visible = true;

            }

        }
    );


    // =================================================
    // COMPLETE EYE
    // =================================================

    if (view === "complete") {

        showAnatomicalInfo(
            "Ocular Globe"
        );

        return;
    }


    // =================================================
    // ANTERIOR SEGMENT
    // =================================================

    if (view === "anterior") {

        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");

        showAnatomicalInfo(
            "Cornea"
        );

        return;
    }


    // =================================================
    // POSTERIOR SEGMENT
    // =================================================

    if (view === "posterior") {

        /*
        Remove the outer shell so the
        posterior anatomy can actually
        be seen.
        */

        hideStructure("sclera");

        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");

        if (App.anatomy) {

            App.anatomy.opticNerve.visible =
                true;

        }

        showAnatomicalInfo(
            "Retina"
        );

        return;
    }


    // =================================================
    // OPTIC PATHWAY
    // =================================================

    if (view === "optic") {

        /*
        The optic nerve lies posterior
        to the globe.

        The anterior shell and internal
        contents are hidden to expose it.
        */

        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");

        if (App.anatomy) {

            App.anatomy.opticNerve.visible =
                true;

            App.anatomy.opticPathway.visible =
                true;

        }

        showAnatomicalInfo(
            "Optic Nerve"
        );

        return;
    }


    // =================================================
    // EXTRAOCULAR MUSCLES
    // =================================================

    if (view === "muscles") {

        /*
        Hide the eye shell so the
        extraocular muscles become
        clearly visible.
        */

        hideStructure("sclera");
        hideStructure("cornea");
        hideStructure("iris");
        hideStructure("pupil");
        hideStructure("lens");
        hideStructure("vitreous");
        hideStructure("retina");
        hideStructure("choroid");

        if (App.anatomy) {

            App.anatomy.muscles.visible =
                true;

        }

        showAnatomicalInfo(
            "Extraocular Muscles"
        );

    }

}
