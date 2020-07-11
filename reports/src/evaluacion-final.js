// @ts-check

var firebase;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('reportId')) {
            alert('URL invalida')
            return;
        }

        const app = firebase.app();
        const firestore = app.firestore();

        const reportId = urlParams.get('reportId')
        const reportRef = firestore.collection("reports").doc(reportId);
        const reportDocument = await reportRef.get()

        if (!reportDocument.exists)
            throw new Error('Report not found');

        const data = reportDocument.data();
        console.log("Document data:", data);

        // start filling the blanks
        document.getElementById('name').innerText = data.mentor.displayName;
        document.getElementById('generatedBy').innerText = `Generado por: ${data.creator.displayName}`;
        document.getElementById('mentorDegree').innerText = data.mentor.degree.name;
        document.getElementById('studentsDegrees').innerText = data.mentor.stats.studentsDegrees.join(', ');
        document.getElementById('assignedStudents').innerText = data.mentor.stats.assignedStudentCount;
        document.getElementById('withAccompaniments').innerText = data.mentor.stats.withAccompaniments.length;
        document.getElementById('withoutAccompaniments').innerText = data.mentor.stats.withoutAccompaniments.length;

        writeReportDate(data.createdAt.toDate());

        document.getElementById('reportSignature').setAttribute('src', data.signature);

        // activities
        document.getElementById('meetings').innerText = data.activities.meetings;
        document.getElementById('sports').innerText = data.activities.sports;
        document.getElementById('academicEvent').innerText = data.activities.academicEvent;
        document.getElementById('socialEvent').innerText = data.activities.socialEvent;
        document.getElementById('virtualAccompaniment').innerText = data.activities.virtualAccompaniment;
        document.getElementById('otherActivities').innerText = data.activities.other;

        // dependencies
        document.getElementById('coordinator').innerText = data.dependencies.coordinator;
        document.getElementById('teachers').innerText = data.dependencies.teachers;
        document.getElementById('missions').innerText = data.dependencies.missions;
        document.getElementById('chancellor').innerText = data.dependencies.chancellor;
        document.getElementById('library').innerText = data.dependencies.library;
        document.getElementById('firstSolvedByMentor').innerText = data.dependencies.firstSolvedByMentor;
        document.getElementById('otherServices').innerText = data.dependencies.otherServices;
        document.getElementById('otherDependencies').innerText = data.dependencies.other;

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
 * 
 * @param {Date} date 
 */
function writeReportDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('reportDate').innerText = date.toLocaleDateString('es-ES', options);
}