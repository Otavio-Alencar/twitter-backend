import { Router } from "express";
import * as pingController from "../controllers/ping"
import * as authController from "../controllers/auth"
import * as tweetController from "../controllers/tweet"
import * as UserController from "../controllers/user"
import * as feedController from "../controllers/feed"
import * as searchController from "../controllers/search"
import * as trendController from "../controllers/trends"
import * as suggestionsController from "../controllers/suggestions"
import { verifyJWT } from "../utils/jwt";
export const mainrouter = Router()


mainrouter.get('/ping', pingController.ping)
mainrouter.get('/privateping', verifyJWT , pingController.privateping)
mainrouter.post('/auth/signup',authController.signup)
mainrouter.post('/auth/signin',authController.signin)
mainrouter.post('/tweet',verifyJWT,tweetController.SendTweet)
mainrouter.get('/tweet/:id',verifyJWT,tweetController.getTweet)
mainrouter.get('/tweet/:id/answers',verifyJWT,tweetController.getAnswers)
mainrouter.post('/tweet/:id/like',verifyJWT,tweetController.likeToggle)
mainrouter.get('/user/:slug',verifyJWT,UserController.getUser)
mainrouter.get('/user/:slug/tweets',verifyJWT,UserController.getUserTweets)
mainrouter.post('/user/:slug/follow',verifyJWT, UserController.followToggle)
mainrouter.put('/user',verifyJWT, UserController.updateUser)
// mainrouter.put('/user/avatar',UserController.editAvatar)
// mainrouter.put('/user/cover',UserController.editCover)
mainrouter.get('/feed',verifyJWT,feedController.getFeed)
mainrouter.get('/search',verifyJWT,searchController.searchTweets)
mainrouter.get('/trending',verifyJWT,trendController.getTrends)
mainrouter.get('/suggestions',verifyJWT,suggestionsController.getSugestions)