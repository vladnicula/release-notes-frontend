import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

interface ReleasesPageServerProps {
  releases: { data: ReleaseData[] }
}

const ReleasesPage: NextPage<ReleasesPageServerProps> = (props) => {

    console.log("Running Releases Render")

    return (
        <div className={styles.container}>
            <h2>Releases List</h2>
            <ul>
                {props.releases.data.map((release) => {
                    return (
                        <li key={release.id}>
                            <Link href={`/releases/${release.id}`}>
                                <a href={`/releases/${release.id}`}>
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

export type ReleaseData = {
  attributes: {
      Title: string;
      ReleaseData: string;
      ReleaseVersion: string;
      Details: string;
  };
  id: number;
}

export const getStaticProps: GetStaticProps = async () => {
    try {
        const res = await fetch(`${process.env.HEADLESS_CMS_URL}/api/release-notes`, {
            headers: {
                "Authorization": `Bearer ${process.env.HEADLESS_CMS_API_TOKEN}`
            }
        })

        const releases = await res.json()

        console.log("here?", releases)

        return {
            props: {
                releases
            },
        }
    } catch (err) {
        console.log(`error`, err)
        return {
            props: { 
                releases: {
                    data: []
                }
            },
            revalidate: 60
        }
    }
}

export default ReleasesPage
