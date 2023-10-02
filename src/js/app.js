import 'pinecone-router-middleware-views';

import Alpine from 'alpinejs'
import PineconeRouter from 'pinecone-router';
import component from 'alpinejs-component'
import { Events } from './events';
import state from './state';
import AlpineI18n from "alpinejs-i18n";

import Glide from '@glidejs/glide'
import { Post } from './models';
import { timeAgo, truncateString } from './utils';

Alpine.plugin(PineconeRouter);
Alpine.plugin(component);
Alpine.plugin(AlpineI18n);

Alpine.store('app', state);

Alpine.data('navigationSlider', () => ({
    /** @type {Glide} */
    _glide: null,
    index: 0,
    init() {
        this._glide = new Glide(this.$refs.glide, {
            perView: 1,
            rewind: false,
        }).mount();

        this._glide.on('mount.after', (e) => {
            this.index = this._glide.index
        });

        this._glide.on('run.after', (e) => {
            this.index = this._glide.index
        });

    },
    dragBind: {
        ['@click']() {
            this._glide.enable();
        },
        ['@mousedown']() {
            const el = this.$event.originalTarget;
            if (!el) {
                this._enable();
                return;
            }

            const parent = this._findParent(el);

            if (this.$root === parent || parent === null) {
                this._enable();
                return;
            }

            this._disable();
        }
    },
    bind: {
        ['@goToLeft']() {
            this._enable();
            this._glide.go('<');
        },
        ['@goToRight']() {
            this._enable();
            this._glide.go('>');
        },
        ['@goTo']() {
            this._enable();
            this._glide.go('=' + this.$event.detail.index);
        },
    },
    _disable() {
        if (!this._glide.disabled) {
            this._glide.disable();
        }
    },
    _enable() {
        if (this._glide.disabled) {
            this._glide.enable();
        }
    },
    _findParent(element) {
        let currentElement = element;

        while (currentElement !== null) {
            if (currentElement.getAttribute('x-data')?.startsWith('navigationSlider')) {
                return currentElement;
            }

            currentElement = currentElement.parentElement;
        }

        return null; // Return null if no matching parent is found
    }
}));

Alpine.data('note', (post, controls = true) => ({
    post: Post(post),
    name: null,
    truncatedName: null,
    username: null,
    ago: null,
    controls: controls,
    showMenu: false,
    init() {
        this.name = this.name ?? this.$store.app.profile.name;
        this.username = this.username ?? this.$store.app.profile.username;
        this.ago = this.ago ?? this.post.updatedAt ? timeAgo(this.post.createdAt) : timeAgo(this.post.updatedAt);
        this.truncatedName = truncateString(this.name, 30);
    },
    bind: {

    }
}));

Alpine.bind('darkMode', {
    [':class']() {
        return {
            dark: this.$store.app.settings.darkMode
        };
    },
    [':style']() {
        const darkMode = this.$store.app.settings.darkMode;
        const fontSize = this.$store.app.settings.fontSize;
        return {
            scrollbarColor: darkMode == true ? '#999 #111827' : '#999 #fff',
            fontSize: fontSize + "px"
        }
    }
})

Events.init();
Alpine.start();

window.Alpine = Alpine;