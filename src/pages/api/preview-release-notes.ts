import type { NextApiRequest, NextApiResponse } from 'next'
import { getReleaseNoteBySlug } from 'api/StrapiAPI'
import { readEnvOrThrow } from 'utils/readEnvOrThrow'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.secret !== readEnvOrThrow('STRAPI_PREVIEW_SECRET')) {
        return res.status(401).json({ message: "Invalid token" })
    }

    const pageData = await getReleaseNoteBySlug(req.query.slug as string, true)

    if (!pageData) {
        return res.status(401).json({ message: "Invalid slug" })
    }

    res.setPreviewData({})

    res.writeHead(307, { Location: `/release-notes/${req.query.slug}` })
    res.end()
};