const brightJs = (function(){
    "use strict";

    function extend (a, b) {
        if (typeof a === 'object') {
            for (const i in a) {
                BrightJs.prototype[i] = a[i];
            }
        } else {
            BrightJs.prototype[a] = b;
        }
    }

    function custom (a, b) {
        if (typeof a === 'object') {
            for (const i in a) {
                this[i] = a[i];
            }
        } else {
            this[a] = b;
        }
    }

    window.addEventListener('load', () => brightJs.ready = true);

    const proto = { custom, extend, ready: false };
    
    class BrightJs {
        constructor (...args) {
            this.elements = args.filter(i => typeof i !== 'object').length === 0 ? args : document.querySelectorAll(args[0]);
            this.length = this.elements.length;
        }

        each (f) {
            Array.from(this.elements).forEach(f);
            return this;
        }

        map (f) {
            Array.from(this.elements).map(f);
            return this;
        }

        filter (f) {
            return Array.from(this.elements).filter(f);
        }

        hasClass () {
            if (this.length === 0) {
                return false;
            } else if (this.length === 1) {
                return this.elements[0].classList.contains(...arguments);
            }
            return this.filter(i => i.classList.contains(...arguments)).length === this.length;
        }

        addClass() {
            this.each(i => i.classList.add(...arguments));
            return this;
        }

        removeClass () {
            this.each(i => i.classList.remove(...arguments));
            return this;
        }

        html (...args) {
            if (args.length > 0) {
                this.each(i => i.innerHTML = args.join(' '));
                return this;
            }
            return this.length === 1 ? this.elements[0].innerHTML : this.map(i => i.innerHTML);
        }

        text(...args) {
            if (args.length > 0) {
                this.each(i => i.textContent = args.join(' '));
                return this;
            }
            return this.length === 1 ? this.elements[0].textContent: this.map(i => i.textContent);
        }

        append(...args) {
            this.each(i => args.forEach(j => i.append(j)));
            return this;
        }

        delay (ms) {
            return new Promise((resolve) => setTimeout(resolve, ms, this));
        }

        closest(e) {
            if (this.length === 1) {
                return new BrightJs(this.elements[0].closest(e));
            }
            return this.map(i => new BrightJs(i.closest(e)));
        }

        css (prop, val) {
            if (val || typeof prop === 'object') {
                if (typeof prop !== 'object') {
                    this.each(i => i.style[prop] = val);
                } else {
                    this.each(i => Object.assign(i.style, prop));
                }
                return this;
            }
            return this.length === 1 ? this.elements[0].style[prop] : this.map(i => i.style[prop]);
        }

        style (a) {
            return this.length === 1 ? window.getComputedStyle(this.elements[0], null)[a] : this.map(i => window.getComputedStyle(i, null)[a]);
        }

        attr (attr, val) {
            if (val) {
                this.each(i => i.setAttribute(attr, val));
                return this;
            }
            return this.length === 1 ? this.elements[0].getAttribute(attr) : this.map(i => i.getAttribute(attr));
        }

        click () {
            this.each(i => i.click());
            return this;
        }

        load (p) {
            return fetch(p).then(r => r.text()).then(t => this.each(i => i.innerHTML = t));
        }

        on () {
            this.each(i => i.addEventListener(...arguments));
            return this;
        }
    }


    return Object.assign((...args) => new BrightJs(...args), proto);
})();

brightJs.custom(console);
brightJs.custom({
    noConflict: () => $ = undefined,
    getJSON: (p) => fetch(p).then(r => r.json()),
    fetch: (...args) => new Promise((resolve, reject) => fetch(...args).then(async r => r.ok ? resolve(await r.text()) : reject(await r.text()))),
    when: (...args) => Promise.all(args),
    delay: (ms) => new Promise(r => setTimeout(r.bind(null, true), ms)),
});

var $ = brightJs;
