import mongoose from "mongoose";

export default async function addHighScorePostType(p = {}) {

    const {wapp} = p;
    return await wapp.server.postTypes.getPostType({
        name: "highScore",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                username: {type: String},
                score: {type: Number, default: 0},
                step: {type: Number, default: 0},
                time: {type: Number, default: 0},
                date: {type: Number, default: 0},
                ip: {
                    type: String,
                    default: "",
                    wapplr: { disabled: true }
                },
            },
            requiredDataForStatus: {
                username: { type: String },
                score: { type: Number },
                step: { type: Number },
                time: { type: Number },
                date: { type: Number },
                ip: { type: String },
            },
            resolvers: {

                new: null,
                save: null,
                delete: null,
                featured: null,
                approve: null,
                ban: null,
                findMany: null,
                findById: null,

                getBrief: function ({TC, Model, statusManager}) {
                    return {
                        extendResolver: "findMany",
                        args: null,
                        resolve: async function (p = {}) {
                            const posts = await Model.find().sort({score: -1, time: 1});
                            if (!posts || (posts && !posts.length)) {
                                return [];
                            }
                            return posts.slice(0, 10)
                        }
                    }
                },
                [wapp.globals.WAPP]: function ({TC, Model, statusManager}) {
                    return {
                        extendResolver: "findMany",
                        args: null,
                        resolve: async function (p = {}) {
                            const posts = await Model.find().sort({score: -1, time: 1});
                            if (!posts || (posts && !posts.length)) {
                                return [];
                            }
                            return posts.slice(0, 1000)
                        }
                    }
                },
                createOne: function ({TC, Model, statusManager}) {
                    return {
                        extendResolver: "createOne",
                        resolve: async function (p = {}) {
                            const {input} = p;
                            const {args, req} = input;
                            const {record} = args;

                            if (record) {
                                record.ip = req.wappRequest.remoteAddress;
                            }

                            const post = new Model({
                                _id: mongoose.Types.ObjectId(),
                                _createdDate: new Date(),
                                _author: null,
                                ...record,
                            });
                            statusManager.setNewStatus(post);
                            const savedPost = await post.save();
                            return {
                                record: savedPost,
                            }
                        }
                    }
                }
            }
        }
    });

}
