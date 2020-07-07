// @ts-check

var firebase;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const app = firebase.app();
        const firestore = app.firestore();

        let reportRef = firestore.collection("/reports").doc("Ulw5NUYm9kj7PCP4Lb2C");

        const reportDocument = await reportRef.get()

        if (!reportDocument.exists)
            throw new Error('Report not found');

        const data = reportDocument.data();
        console.log("Document data:", data);

        // start filling the blanks
        document.getElementById('name').innerText = data.mentor.displayName;
        document.getElementById('generatedBy').innerText = `Generado por: ${data.report.displayName}`;
        document.getElementById('mentorDegree').innerText = data.mentor.degree.name;

        writeReportDate(data.report.reportCreationTime.toDate());

        document.getElementById('reportSignature').setAttribute('src', data.signature);

        // activities
        document.getElementById('meetings').innerText = data.activities.meetings;
        document.getElementById('sports').innerText = data.activities.sports;
        document.getElementById('academicEvent').innerText = data.activities.academicEvent;
        document.getElementById('socialEvent').innerText = data.activities.socialEvent;
        document.getElementById('virtualAccompaniment').innerText = data.activities.virtualAccompaniment;
        document.getElementById('other').innerText = data.activities.other;

        // dependencies
        document.getElementById('coordinator').innerText = data.dependencies.coordinator;
        document.getElementById('teachers').innerText = data.dependencies.teachers;
        document.getElementById('missions').innerText = data.dependencies.missions;
        document.getElementById('chancellor').innerText = data.dependencies.chancellor;
        document.getElementById('library').innerText = data.dependencies.library;
        document.getElementById('firstSolvedByMentor').innerText = data.dependencies.firstSolvedByMentor;
        document.getElementById('otherServices').innerText = data.dependencies.otherServices;
        document.getElementById('other').innerText = data.dependencies.other;

        // observations
        document.getElementById('positives').innerText = data.observations.positives;
        document.getElementById('inconveniences').innerText = data.observations.inconveniences;
        document.getElementById('suggestions').innerText = data.observations.suggestions;

    } catch (e) {
        console.error(e);
        alert('No se pudo cargar el reporte')
    }
});

/**
inconveniences: "Claw drapes poop in the plant pot so eats owners hair then claws head, yet attempt to leap between furniture but woefully miscalibrate and bellyflop onto the floor"
positives: ""
suggestions: ""
 */

/**
 * 
 * @param {Date} date 
 */
function writeReportDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('reportDate').innerText = date.toLocaleDateString('es-ES', options);
}