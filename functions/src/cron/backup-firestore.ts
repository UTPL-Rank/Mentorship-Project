import * as functions from 'firebase-functions';
import * as firestore from '@google-cloud/firestore';

const client = new firestore.v1.FirestoreAdminClient();

const bucket = 'gs://sgmentores-backups';

exports.scheduledFirestoreExport = functions.pubsub
    .schedule('30 2 * * 7')
    .onRun((context: any) => {

        const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || 'sgmentores';
        const databaseName =
            client.databasePath(projectId, '(default)');

        return client.exportDocuments({
            name: databaseName,
            outputUriPrefix: bucket,
            // Leave collectionIds empty to export all collections
            // or set to a list of collection IDs to export,
            // collectionIds: ['users', 'posts']
            collectionIds: []
        })
            .then((responses: any) => {
                const response = responses[0];
                console.log(`Operation Name: ${response['name']}`);
            })
            .catch((err: any) => {
                console.error(err);
                throw new Error('Export operation failed');
            });
    });
