import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { ReleaseNoteDTO } from 'api/ReleaseNoteDTO'
import { getReleaseNoteById } from 'api/StrapiAPI'


interface PostPageServerProps {
    releaseNote?: { data: ReleaseNoteDTO }
}

const ReleasePage: NextPage<PostPageServerProps> = (props) => {    
    return (
        <div>
            {JSON.stringify(props.releaseNote, null, 2)}
        </div>
    )
}


export const getStaticProps: GetStaticProps = async (context) => {
    let { id } = context.params ?? {}
    if ( !id ) {
        throw new Error(`Id not specified`)
    }

    id = Array.isArray(id) ? id[0] : id

    const releaseNote = (await getReleaseNoteById(id)).data

    return {
        props: {
            releaseNote
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
