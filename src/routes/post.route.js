import express from 'express'
export const postRouter = express.Router()
import { protectedRoute } from '../middlewares/verifyToken.js'

import { getAllPost, getSinglePost, createPost, updatePost, deletePost, getAllMyPost } from '../controllers/post.controller.js'

postRouter.use(protectedRoute)
postRouter.post('/create', createPost)
postRouter.put('/edit/:id', updatePost)
postRouter.delete('/delete/:id', deletePost)

postRouter.get('/', getAllPost)
postRouter.get('/my-posts', getAllMyPost)
postRouter.get('/:id', getSinglePost)