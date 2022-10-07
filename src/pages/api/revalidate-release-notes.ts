import type { NextApiRequest, NextApiResponse } from 'next'
import { ReleaseNoteDTO } from "api/ReleaseNoteDTO"
import { readEnvOrThrow } from 'utils/readEnvOrThrow'

type WebhookBodyOnlyPostNow = {
    event: 'entry.publish' | 'entry.update' | 'entry.create' | 'entry.unpublish';
    createdAt: string;
    model: 'release-notes';
    entry: ReleaseNoteDTO;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check for secret to confirm this is a valid request
    const revalidatationToken = readEnvOrThrow('REVALIDATE_TOKEN')
    if (req.headers.REVALIDATE_TOKEN !== revalidatationToken) {
        console.log("REVALIDATE token not valid", "expected", revalidatationToken, "got", req.headers.REVALIDATE_TOKEN)
        console.log("req.headers", req.headers)
        return res.status(401).json({ message: 'Invalid token' })
    }
  
    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        // await res.revalidate('/path-to-revalidate')
        // console.log("revalidate handler request body", req.body)
        const content = req.body as WebhookBodyOnlyPostNow
        await res.revalidate(`/release-notes/${content.entry.id}`)
        await res.revalidate(`/`)
        console.log("revalidation complete", `/release-notes/${content.entry.id}`, 'and homepage (/)')
        return res.json({ revalidated: true })
    } catch (err) {
        console.log("problmes", err)

        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}
