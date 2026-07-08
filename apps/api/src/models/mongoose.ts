import mongoose from "mongoose";

export const SCHEMA_OPTS = {
    toJSON: { virtuals: true },
    toObject: {
        virtuals: true,
        transform: (_doc: any, ret: any) => {
            for (const key in ret) {
                if (ret[key] instanceof mongoose.Types.ObjectId) {
                    ret[key] = ret[key].toString();
                }
            }
            return ret;
        }
    },
    id: true,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'lastUpdatedOn'
    }
};
