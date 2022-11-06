const brightJs = (function(){
    "use strict";

    function concat (arr) {
        return arr.map(i => i.length ? Array.from(i) : i).flat().filter(Boolean);
    }

    function parseHTML (...str) {
        const parent = document.createElement('div');
        parent.innerHTML = str.join('');
        return new BrightJs(...parent.children);
    }

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

    const proto = { custom, extend, ready: false, parseHTML };
    
    class BrightJs {
        constructor (...args) {
            this.elements = args.filter(i => typeof i !== 'object').length === 0 ? concat(args.map(i => i.isBrightJs ? i.elements : i)) : document.querySelectorAll(args[0]);
            this.length = this.elements.length;
            this.isBrightJs = true;
        }

        each (f) {
            Array.from(this.elements)?.forEach(f);
            return this;
        }

        map (f) {
            Array.from(this.elements)?.map(f);
            return this;
        }

        apply (args, obj) {
            if (!args) return this;
            this.each(i => {
                args.forEach(j => {
                    if (typeof j === 'string') {
                        obj?.isString(i, j)
                    } else if (j.isBrightJs) {
                        obj?.isBrightJs(i, j);
                    } else {
                        obj?.default(i, j);
                    }
                });
            });
            return this;
        }

        filter (f) {
            return Array.from(this.elements)?.filter(f);
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
            return this.each(i => i.click());
        }

        load (p) {
            return fetch(p).then(r => r.text()).then(t => this.each(i => i.innerHTML = t));
        }

        clone () {
            return new BrightJs(...Array.from(this.elements).map(i => i.cloneNode(true)));
        }

        before (...args) {
            return this.apply(args, {
                isString: (i, j) => i.before(...parseHTML(j).elements),
                isBrightJs: (i, j) => i.before(...j.elements),
                default: (i, j) => i.before(j)
            });
        }

        after (...args) {
            return this.apply(args, {
                isString: (i, j) => i.after(...parseHTML(j).elements),
                isBrightJs: (i, j) => i.after(...j.elements),
                default: (i, j) => i.after(j)
            });
        }

        append (...args) {
            return this.apply(args, {
                isString: (i, j) => i.innerHTML += j,
                isBrightJs: (i, j) => i.append(...j.elements),
                default: (i, j) => i.appendChild(j)
            })
        }

        appendTo() {
            $(...arguments).append(...this.elements);
            return this;
        }

        on () {
            return this.each(i => i.addEventListener(...arguments));
        }

        removeEvent (...args) {
            return this.each(i => {
                i.removeEventListener(...args);
            });
        }

        focus (a) {
            return this.each(i => i.focus(a));
        }

        blur () {
            return this.each(i => i.blur());
        }

        remove () {
            this.each(i => i.remove());
            return undefined;
        }

        change (val) {
            return this.each(i => {
                i.value = val;
                i.dispatchEvent(new Event('change'));
            });
        }

        trigger (...args) {
            if (!args) return this;
            args.forEach(i => {
                const e = new Event(i);
                this.each(j => j.dispatchEvent(e));
            });
            return this;
        }

        *[Symbol.iterator]() {
            for (const i of this.elements) {
                yield i;
            }
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
    from: brightJs.parseHTML,
});

var $ = brightJs;
