import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { ReleaseNoteDTO } from 'api/ReleaseNoteDTO'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

import Markdown from "markdown-to-jsx"
import { getReleaseNoteBySlug } from 'api/StrapiAPI'


interface PostPageServerProps {
    releaseNote?: ReleaseNoteDTO
    preview?: null | boolean
}

const ReleasePage: NextPage<PostPageServerProps> = (props) => {    
    console.log("Rendering ReleasePage by Slug", props)

    const router = useRouter()

    // clear-preview-release-notes
    const handleClearPreviewMode = useCallback(async () => {
        await fetch('/api/clear-preview-release-notes')
        router.replace('/')
    }, [router])

    if ( !props.releaseNote ) {
        return null
    }

    const { Details, ...rest } = props.releaseNote.attributes

    return (
        <div>
            { props.preview ? <h2>Preview mode <button onClick={handleClearPreviewMode}>Clear</button></h2> : null }
            <Markdown>{Details}</Markdown>
            <pre>
                {JSON.stringify(rest, null, 2)}
            </pre>
        </div>
    )
}


export const getStaticProps: GetStaticProps<PostPageServerProps> = async (context) => {
    let { slug } = context.params ?? {}
    if ( !slug ) {
        throw new Error(`Slug not specified`)
    }

    slug = Array.isArray(slug) ? slug[0] : slug
    const releaseNote = await getReleaseNoteBySlug(slug, context.preview)

    if ( !releaseNote ) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            releaseNote: releaseNote,
            preview: context.preview ?? null
        }
    }
}

export const getStaticPaths: GetStaticPaths = () => {    
    return {
        paths: [],
        // blocking instead of true, see https://github.com/vercel/next.js/discussions/38193#discussioncomment-3055165
        fallback: 'blocking',
    }
}

export default ReleasePage
