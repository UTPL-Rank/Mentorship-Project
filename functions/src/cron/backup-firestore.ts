import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';

const client = firestore.v1.FirestoreAdminClient;


const bucket = 'gs://sgmentores-backups';

export const scheduledFirestoreExport =
    functions
        .pubsub
        .schedule('30 2 * * 7')
        .onRun(async _ => {
            // This code does not works
            // const projectId: string | null = process.env.GCP_PROJECT ?? process.env.GCLOUD_PROJECT ?? null;
            // This code works
            const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

            if (!projectId)
                throw new Error('Property project id not found');


            const databaseName =
                client
                    .databasePath(projectId, '(default)');

            try {
                const responses = await client.exportDocuments({
                    name: databaseName,
                    outputUriPrefix: bucket,
                    // Leave collectionIds empty to export all collections
                    // or set to a list of collection IDs to export,
                    // collectionIds: ['users', 'posts']
                    collectionIds: []
                })

                const response = responses[0];
                console.log(`Operation Name: ${response['name']}`);

                return responses;
            } catch (err) {
                console.error(err);
                throw new Error('Export operation failed');
            }
            ;

        });
