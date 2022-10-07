import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import styles from 'styles/Home.module.css'

import { ReleaseNoteDTO } from 'api/ReleaseNoteDTO'
import { getReleaseNotesList } from 'api/StrapiAPI'


interface ReleasesPageServerProps {
  releaseNotes: { data: ReleaseNoteDTO[] }
}

const ReleasesPage: NextPage<ReleasesPageServerProps> = (props) => {

    console.log("Running Releases Render")

    return (
        <div className={styles.container}>
            <h2>Releases List</h2>
            <ul>
                {props.releaseNotes.data.map((release) => {
                    return (
                        <li key={release.id}>
                            <Link href={`/release-notes/${release.id}`}>
                                <a href={`/release-notes/${release.id}`}>
                                    {release.attributes.Title}
                                </a>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export const getStaticProps: GetStaticProps<ReleasesPageServerProps> = async () => {
    const releaseNotes = (await getReleaseNotesList()).data

    try {
        return {
            props: {
                releaseNotes: releaseNotes
            },
        }
    } catch (err) {
        console.log(`error`, err)
        return {
            props: { 
                releaseNotes: {
                    data: []
                }
            },
            revalidate: 60
        }
    }
}

export default ReleasesPage
