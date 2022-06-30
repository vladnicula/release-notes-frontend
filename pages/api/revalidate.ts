import type { NextApiRequest, NextApiResponse } from 'next'

type WebhookBodyOnlyPostNow = {
    event: 'entry.publish' | 'entry.update' | 'entry.create' | 'entry.unpublish';
    createdAt: string;
    model: 'post';
    entry: {
        id: number;
        Title: string;
        publishDate: string | null;
        Content: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string | null;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
  
    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        // await res.revalidate('/path-to-revalidate')
        console.log("ce lampa mea", req.body)
        const content = req.body as WebhookBodyOnlyPostNow
        await res.revalidate(`/posts/${content.entry.id}`)
        console.log("revalidation complete", `/posts/${content.entry.id}`)
        
        return res.json({ revalidated: true })
    } catch (err) {
        console.log("problmes", err)

        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}
