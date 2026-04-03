const brightJs = (function(){
    "use strict";

    function concat (arr) {
        return arr.map(i => i.length ? Array.from(i) : i).flat().filter(Boolean);
    }

    function getIndex (e) {
        Array.prototype.indexOf.call(e.parentNode.children, e);
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

    function setProp (obj, path, val) {
        const [head, ...rest] = path;

        if (obj[head]) {
            if (rest.length > 0) {
                setProp(obj[head], rest, val);
            } else {
                Object.defineProperty(obj, head, {
                    value: val
                });
            }
        }
    }


    function getProp (obj, path) {
        const [head, ...rest] = typeof path === 'string' ? path.split('.') : path;

        if (obj[head]) {
            if (rest.length > 0) {
                return getProp(obj[head], rest);
            } else {
                return obj[head];
            }
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
            return this.each(i => {
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
        }

        filter (f) {
            return Array.from(this.elements)?.filter(f);
        }

        addClass() {
            return this.each(i => i.classList.add(...arguments));
        }

        after (...args) {
            if (args.length === 0) {
                return this.length === 1 ? this.elements[0].nextSibling : this.map(i => i.nextSibling);
            }
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
            return $(...arguments).append(...this.elements);
        }

        attr (attr, val) {
            if (val) {
                return this.each(i => i.setAttribute(attr, val));
            }
            return this.length === 1 ? this.elements[0].getAttribute(attr) : this.map(i => i.getAttribute(attr));
        }

        before (...args) {
            if (args.length === 0) {
                return this.length === 1 ? this.elements[0].previousSibling : this.map(i => i.previousSibling);
            }
            return this.apply(args, {
                isString: (i, j) => i.before(...parseHTML(j).elements),
                isBrightJs: (i, j) => i.before(...j.elements),
                default: (i, j) => i.before(j)
            });
        }

        blur () {
            return this.each(i => i.blur());
        }

        change (val) {
            return this.each(i => {
                i.value = val;
                i.dispatchEvent(new Event('change'));
            });
        }

        children () {
            return this.length === 1 ? this.elements[0].children : this.map(i => i.children);
        }

        click () {
            return this.each(i => i.click());
        }

        clone () {
            return new BrightJs(...Array.from(this.elements).map(i => i.cloneNode(true)));
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
                    return this.each(i => i.style[prop] = val);
                } else {
                    return this.each(i => Object.assign(i.style, prop));
                }
            }
            return this.length === 1 ? this.elements[0].style[prop] : this.map(i => i.style[prop]);
        }

        delay (ms) {
            return new Promise((resolve) => setTimeout(resolve, ms, this));
        }

        find (s) {
            return this.length === 0 ? new BrightJs(this.elements[0].querySelectorAll(s)) : new BrightJs(Array.from(this.elements).map(i => Array.from(i.querySelectorAll(s))).flat());
        }

        findOne (s) {
            return this.length === 0 ? new BrightJs(this.elements[0].querySelector(s)) : new BrightJs(Array.from(this.elements).map(i => i.querySelector(s)).flat());
        }

        firstChild () {
            return this.length === 1 ? this.elements[0].firstChild : this.map(i => i.firstChild);
        }

        focus (a) {
            return this.each(i => i.focus(a));
        }

        get (prop) {
            return this.length === 1 ? getProp(this.elements[0], prop) : this.map(i => getProp(i, prop));
        }

        hasClass () {
            if (this.length === 0) {
                return false;
            } else if (this.length === 1) {
                return this.elements[0].classList.contains(...arguments);
            }
            return this.filter(i => i.classList.contains(...arguments)).length === this.length;
        }

        id (i) {
            if (i) {
                this.elements[0].id = i;
                return this;
            }
            return this.elements[0].id;
        }

        index () {
            return this.length === 0 ? getIndex(this.elements[0]) : this.map(getIndex);
        }

        hasChild () {
            return this.length === 1 ? this.elements[0].children.length !== 0 : this.map(i => i.children.length !== 0);
        }

        height (h) {
            if (h) {
                return this.each(i => i.style.height = h + 'px');
            }
            return this.length === 1 ? this.elements[0].offsetHeight || this.elements[0].innerHeight : this.map(i => this.elements[0].offsetHeight || this.elements[0].innerHeight);
        }

        html (...args) {
            if (args.length > 0) {
                this.each(i => i.innerHTML = args.join(' '));
                return this;
            }
            return this.length === 1 ? this.elements[0].innerHTML : this.map(i => i.innerHTML);
        }

        lastChild () {
            return this.length === 1 ? this.elements[0].lastChild : this.map(i => i.lastChild);
        }

        load (p) {
            return fetch(p).then(r => r.text()).then(t => this.each(i => i.innerHTML = t));
        }

        on () {
            return this.each(i => i.addEventListener(...arguments));
        }

        parent () {
            return this.length === 1 ? this.elements[0].parent : this.map(i => i.parent);
        }

        remove () {
            this.each(i => i.remove());
            return undefined;
        }

        removeClass () {
            this.each(i => i.classList.remove(...arguments));
            return this;
        }

        removeEvent (...args) {
            return this.each(i => {
                i.removeEventListener(...args);
            });
        }

        scrollTo (x, y, b = 'smooth') {
            return this.each(i => i.scrollTo({ top: y, left: x, behavior: b }));
        }

        scrollTop (b) {
            return this.scrollTo(undefined, 0, b);
        }

        scrollLeft (b) {
            return this.scrollTo(0, undefined, b);
        }

        scrollRight (b = 'smooth') {
            return this.each(i => i.scrollTo({ left: i.offsetWidth || i.innerWidth, behavior: b }));
        }

        scrollBottom (b = 'smooth') {
            return this.each(i => i.scrollTo({ top: i.offsetHeight || i.innerHeight, behavior: b }));
        }

        set (prop, val) {
            return this.each(i => setProp(i, prop.split('.'), val));
        }

        siblings () {
            const b = this.before();
            const a = this.after();
            const arr = b.map((i, j) => [i, [a[j]]]);
            return this.length === 1 ? arr[0] : arr;
        }

        style (a) {
            return this.length === 1 ? window.getComputedStyle(this.elements[0], null)[a] : this.map(i => window.getComputedStyle(i, null)[a]);
        }

        text(...args) {
            if (args.length > 0) {
                this.each(i => i.textContent = args.join(' '));
                return this;
            }
            return this.length === 1 ? this.elements[0].textContent: this.map(i => i.textContent);
        }

        toogleAttr (n, f) {
            return this.each(i => i.toggleAttribute(n, f));
        }

        toogleClass(c) {
            return this.each(i => i.classList.toogle(c));
        }

        trigger (...args) {
            if (!args) return this;
            args.forEach(i => {
                const e = new Event(i);
                this.each(j => j.dispatchEvent(e));
            });
            return this;
        }

        val (v) {
            if (v) this.each(i => i.value = v);
            return this.length === 1 ? this.elements[0].value : this.map(i => i.value);
        }

        width (w) {
            if (w) {
                return this.each(i => i.style.width = w + 'px');
            }
            return this.length === 1 ? this.elements[0].offsetWidth || this.elements[0].innerWidth : this.map(i => this.elements[0].offsetWidth || this.elements[0].innerWidth);
        }       

        *[Symbol.iterator]() {
            for (const i of this.elements) {
                yield new BrightJs(i);
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
