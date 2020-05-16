//@ts-check

/**
 * Author: Bruno Esparza
 *
 * Calculate the stats generated each period by the mentors registered in the platform
 */


const admin = require("firebase-admin");
const serviceAccount = require("./../credentials.json");

// @ts-ignore
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();


async function getAllMentors() {
    const snap = await db.collection('mentors').get();
    return snap.docs.map(s => s.data());
}

/**
 * 
 * @param {Array<any>} mentors 
 */
function mentorPerArea(mentors) {
    const mentorPerArea = new Map();

    // for each mentor, store it in corresponding area entry
    mentors.forEach(mentor => {
        const areaId = mentor.area.reference.id;


        // Increment the data already stored
        if (mentorPerArea.has(areaId)) {
            // get entry
            const entry = mentorPerArea.get(areaId);

            // update the data of the entry
            entry.studentsCount += mentor.stats.assignedStudentCount;
            entry.accompanimentsCount += mentor.stats.accompanimentsCount;

            // store data with updated values
            mentorPerArea.set(areaId, entry);
        } else {
            // create a new entry with the area and first mentor
            const newEntry = {
                id: areaId,
                name: mentor.area.name,
                studentsCount: mentor.stats.assignedStudentCount,
                accompanimentsCount: mentor.stats.accompanimentsCount,
            };

            // store new entry in the map
            mentorPerArea.set(areaId, newEntry);
        }
    });

    return Array.from(mentorPerArea.values());
}

/**
 * 
 * @param {Array<any>} mentorsPerArea 
 */
async function saveMentors(mentorsPerArea) {
    const batch = db.batch();

    mentorsPerArea.forEach(area => {
        const ref = db.collection('academic-periods/abr20-ago20/academic-areas-stats').doc(area.id);
        batch.set(ref, area)
    })

    await batch.commit();
}


// MAIN
(async () => {
    const mentors = await getAllMentors();
    const mentorsPerArea = mentorPerArea(mentors);

    await saveMentors(mentorsPerArea);

    console.table(mentorsPerArea);
})();