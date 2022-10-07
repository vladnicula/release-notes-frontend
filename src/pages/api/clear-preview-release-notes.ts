import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        // Clears the preview mode cookies.
        // This function accepts no arguments.
        res.clearPreviewData()

        return res.status(200).json({ message: 'Cookies Cleared' })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}