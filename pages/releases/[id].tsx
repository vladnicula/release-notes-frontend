import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { ReleaseData } from '../releases'
interface PostPageServerProps {
    post?: {data: ReleaseData}
}

const ReleasePage: NextPage<PostPageServerProps> = (props) => {    
    return (
        <div>
            {JSON.stringify(props.post, null, 2)}
        </div>
    )
}


export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params ?? {}
    const res = await fetch(`${process.env.HEADLESS_CMS_URL}/api/release-notes/${id}`, {
        headers: {
            "Authorization": `Bearer ${process.env.HEADLESS_CMS_API_TOKEN}`
        }
    })

    const post = await res.json()

    console.log("getStaticProps fetched post data", post)

    return {
        props: {
            post
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
