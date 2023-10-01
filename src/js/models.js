import { v4 } from "uuid";

/**
 * @typedef OldPost
 * @property {string} date
 * @property {string} content
 * @property {bool} isBookmarked
 * @property {bool} isLiked
 * @property {bool} isEdited
 * @property {int} replyId
 */

/**
 * @typedef Post
 * @property {string} content
 * @property {bool} isBookmarked
 * @property {bool} isLiked
 * @property {string|null} parentId
 * @property {int} createdAt
 * @property {int} updatedAt
 * @property {string} uuid
 */

/**
 * @returns {Post}
 */
export const Post = ({
    content = '',
    isBookmarked = false,
    isLiked = false,
    parentId = null,
    createdAt = Date.now(),
    updatedAt = null,
    uuid = null,
} = {}) => ({
    uuid: uuid ? uuid : v4(),
    content,
    isBookmarked,
    isLiked,
    parentId,
    createdAt,
    updatedAt,
    extractCategories() {
        return [
            ...new Set(
                this.content
                    .match(/#\w+/g)
                    .map((v) => v.substring(1).toLowerCase())
            )
        ];
    },
    getCreatedAt() {
        return new Date(this.createdAt);
    },
    getUpdatedAt() {
        return new Date(this.updatedAt);
    },
})