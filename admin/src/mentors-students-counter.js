//@ts-check

/**
 * Author: Bruno Esparza
 *
 * Calculate the students with accompaniments per user
 */

const admin = require("firebase-admin");
const serviceAccount = require("../credentials.json");
const assert = require('assert').strict;


// @ts-ignore
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

// admin.firestore.setLogFunction((log) => {
//     console.log(log);
// });


// MAIN
(async () => {
    const studentsSnaps = await db.collection('students').get();
    const students = studentsSnaps.docs.map(d => d.data());

    // group students by mentor and whit or without accompaniments
    const studentsWithAccompaniments = students.reduce((obj, s) => {
        // check if mentor exists 
        if (!obj[s.mentor.reference.id])
            obj[s.mentor.reference.id] = { withAccompaniments: [], withoutAccompaniments: [], degrees: [], cycles: [] };

        // add student to respective list
        if (!s.stats.accompanimentsCount)
            obj[s.mentor.reference.id].withoutAccompaniments.push(s.displayName);
        else
            obj[s.mentor.reference.id].withAccompaniments.push(s.displayName);

        const studentDegree = s.degree.name;
        if (!obj[s.mentor.reference.id].degrees.includes(studentDegree))
            obj[s.mentor.reference.id].degrees.push(studentDegree);

        const studentCycle = s.cycle;
        if (!obj[s.mentor.reference.id].cycles.includes(studentCycle))
            obj[s.mentor.reference.id].cycles.push(studentCycle);

        return obj;
    }, {});

    // count students from result
    let count = 0;
    for (const key in studentsWithAccompaniments) {
        if (studentsWithAccompaniments.hasOwnProperty(key)) {
            const element = studentsWithAccompaniments[key];
            count += element.withoutAccompaniments.length + element.withAccompaniments.length
        }
    }

    // test all students have been indexed
    assert.equal(count, studentsSnaps.size, new Error('not all students have been indexed'));

    // save on firestore
    const batch = db.batch();
    for (const key in studentsWithAccompaniments) {
        if (studentsWithAccompaniments.hasOwnProperty(key)) {
            const student = studentsWithAccompaniments[key];
            const ref = db.collection('mentors').doc(key)
            batch.update(ref, 'students.withoutAccompaniments', student.withoutAccompaniments);
            batch.update(ref, 'students.withAccompaniments', student.withAccompaniments);
            batch.update(ref, 'students.degrees', student.degrees);
            batch.update(ref, 'students.cycles', student.cycles);
        }
    }

    await batch.commit();

    console.log('=========COMPLETED=========');

})();