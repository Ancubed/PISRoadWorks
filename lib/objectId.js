import mongoose from 'mongoose'

import dbConnect from '../lib/mongoose'
(async () => await dbConnect())(); 

const ObjectId = (str) => new mongoose.Types.ObjectId(str)

export default ObjectId