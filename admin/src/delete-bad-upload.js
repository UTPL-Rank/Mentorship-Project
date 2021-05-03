
const admin = require("firebase-admin");
const serviceAccount = require("../credentials.json");

// @ts-ignore
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const period = db.doc('academic-periods/abr21-ago21')

async function deleteMentors() {
    const snap = await db.collection('mentors').where('period.reference', '==', period).get();
    console.log('---------------Mentors---------------');
    console.log(snap.docs.map(doc => doc.id));
    const task = snap.docs.map(async doc => await doc.ref.delete())

    await Promise.all(task);
}

async function deleteStudents() {
    const snap = await db.collection('students').where('period.reference', '==', period).get();
    console.log('---------------Students---------------');
    console.log(snap.docs.map(doc => doc.id));
    const task = snap.docs.map(async doc => await doc.ref.delete())

    await Promise.all(task);
}

async function deleteIntegrators() {
    console.log('---------------Integrators---------------');
    const snap = await db.collection('integrators').where('period.reference', '==', period).get();
    console.log(snap.docs.map(doc => doc.id));
    const task = snap.docs.map(async doc => await doc.ref.delete())

    await Promise.all(task);
}

// MAIN
(async () => {
    await deleteMentors();
    await deleteIntegrators();
    await deleteStudents();
})();