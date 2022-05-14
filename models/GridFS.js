import mongoose from 'mongoose'

import dbConnect from '../lib/mongoose'
(async () => await dbConnect())(); 

class GridFS {
    constructor(bucketName = 'files') {
        this.bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection,
            {
                bucketName: bucketName
            }
        );
    }

    upload(filename, readStream, metadata = null) {
        return new Promise((resolve, reject) => {
            readStream
            .pipe(this.bucket.openUploadStream(filename, {
                metadata: metadata
            }))
            .on('error', (err) => reject(err))
            .on('finish', (file) => resolve({
                _id: file._id,
                filename: file.filename
            }))
        });
    }

    download(fileId, res) {
        return new Promise((resolve, reject) => {
            this.bucket.find({ _id: new mongoose.Types.ObjectId(fileId) })
            .toArray()
            .then(files => {
                if (!files || files.length === 0) reject(new Error('Файл не найден'))

                res.setHeader('Content-Disposition', `attachment; filename=${files[0].filename}`)

                this.bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
                .pipe(res)
                .on('error', (err) => reject(err))
                .on('finish', (file) => resolve(file))
            })
            .catch(err => reject(err));
        });
    }

    async delete(fileId) {
        await this.bucket.delete(new mongoose.Types.ObjectId(fileId))
    }
}

const GridFSObject = new GridFS();

export default GridFSObject