import Alpine from "alpinejs";
import persist from '@alpinejs/persist'
import { Post } from "./models";
import { LzStorage as compression } from "./storage";

Alpine.plugin(persist);

export default {
    /**
     * @type {Date|null}
     */
    _firstTimeAt: Alpine.$persist(null).as('app:firstTimeAt'),
    _defaultLocale: 'en',
    _locale: 'en',
    _hasOldData: false,
    _oldData: {},
    profile: Alpine.$persist({
        name: 'My name',
        username: 'My username',
        bio: 'Mine is your personal space. Try customizing it!',
        picture: null,
        banner: null
    }).as('config:profile'),
    settings: Alpine.$persist({
        darkMode: true,
        returnOnSave: true,
        fontSize: 16,
    }).as('config:preferences'),
    posts: Alpine.$persist([]).as('app:posts').using(compression),
    init() {
        setTimeout(() => {
            if (this.posts === null) {
                this.posts = [
                    Post({
                        content: "My first post!",
                        isBookmarked: true,
                        isLiked: true,
                        createdAt: Date.now(),
                    })
                ];
            }

            this.initOldMigration();
        }, 10); // Delay since Persist needs to mutate the variables

        this.initFirstTime();
        this.initWatch();
    },
    initFirstTime() {
        setTimeout(() => this._firstTimeAt == null && (this._firstTimeAt = new Date), 100); // Delay to allow check first timers
    },
    initOldMigration() {
        this._hasOldData = localStorage.getItem('posts') !== null;

        if (!this._hasOldData) {
            return;
        }

        this.migrateOldData();
    },
    initWatch() {
        Alpine.effect(() => {
            /* Your code goes here */
        });
    },
    async migrateOldData() {
        this._oldData = {
            posts: [],
            profile: {},
            settings: {}
        };

        this._oldData.posts = JSON.parse(localStorage.getItem("posts")) ?? [];
        this._oldData.profile.name = localStorage.getItem("name");
        this._oldData.profile.username = localStorage.getItem("username");
        this._oldData.profile.bio = localStorage.getItem("description");
        this._oldData.settings.darkMode = localStorage.getItem("darkMode") === null ? true : (localStorage.getItem("darkMode") == 'true');
        this._oldData.settings.returnOnSave = localStorage.getItem("returnSave") === null ? true : (localStorage.getItem("returnSave") == 'true');
        this._oldData.settings.fontSize = localStorage.getItem("fontSize") ?? 16;

        for (const key in this._oldData.settings) {
            const setting = this._oldData.settings[key];

            this.settings[key] = setting;
        }

        for (const key in this._oldData.profile) {
            const setting = this._oldData.profile[key];

            this.profile[key] = setting;
        }

        let converted = [];

        this._oldData.posts.forEach((
            /** @type {import("./models").OldPost} */
            post
        ) => {
            const date = (new Date(post.date)).getMilliseconds();

            converted.push(
                Post({
                    content: post.content,
                    parentId: post.replyId ? converted[post.replyId]?.uuid : null,
                    isLiked: post.isLiked,
                    isBookmarked: post.isBookmarked,
                    updatedAt: date,
                    createdAt: date,
                })
            );
        });

        this.posts = converted;

        localStorage.removeItem("posts")
        localStorage.removeItem("name");
        localStorage.removeItem("username");
        localStorage.removeItem("description");
        localStorage.removeItem("darkMode");
        localStorage.removeItem("returnSave");
        localStorage.removeItem("fontSize");
    }
};