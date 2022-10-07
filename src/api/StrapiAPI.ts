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
    return StrapiAPI.get<ReleaseNotesListAPIResponse>(`/release-notes`)
}



export type ReleaseNoteByIdAPIResponse = {
    data: ReleaseNoteDTO
}
export const getReleaseNoteById = async (id: string) => {
    return StrapiAPI.get<ReleaseNoteByIdAPIResponse>(`/release-notes/${id}`)
}
