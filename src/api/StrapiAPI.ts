import axios from 'axios'
import { readEnvOrThrow } from '../utils/readEnvOrThrow'
import { ReleaseNoteDTO } from './ReleaseNoteDTO'

export const StrapiAPI = axios.create({
    baseURL: `${readEnvOrThrow('HEADLESS_CMS_URL')}/api`,
    headers: {
        "Authorization": `Bearer ${readEnvOrThrow('HEADLESS_CMS_API_TOKEN')}`
    }
})

export type StrapiAPIListingMeta = {
    meta: { pagination: { page: number, pageSize: number, pageCount: number, total: number } }
}

export type ReleaseNotesListAPIResponse = {
    data: ReleaseNoteDTO[]
} & StrapiAPIListingMeta

export const getReleaseNotesList = async () => {
    return StrapiAPI.get<ReleaseNotesListAPIResponse>(`/release-notes?publicationState=live`)
}



export type ReleaseNoteByIdAPIResponse = {
    data: ReleaseNoteDTO
}
export const getReleaseNoteById = async (id: string) => {
    return StrapiAPI.get<ReleaseNoteByIdAPIResponse>(`/release-notes/${id}?publicationState=live&filters[publishedAt][$notNull]=true`)
}


// http://localhost:3000/api/preview-release-notes?secret=potatosRu4L@W0rlDDD134&slug=1-0-3
export const getReleaseNoteBySlug = async (slug: string, previewMode: boolean | null = null) => {
    const publicationState = previewMode ? "preview" : "live"
    const requestUrlPart = `/release-notes?publicationState=${publicationState}&filters[slug][$eq]=${slug}`
    const resultsBySlug = await StrapiAPI.get<ReleaseNotesListAPIResponse>(requestUrlPart)
    return resultsBySlug.data.data[0] as ReleaseNoteDTO | undefined
}
