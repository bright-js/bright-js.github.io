const $ = (function() {
  "use strict";

  function extend(name, fn) {
    BrightJs.prototype[name] = fn;
  }

  const proto = {
    ...console,
    fn: {
      extend
    }
  };

  class BrightJs {
    constructor(...args) {
      this.elements = args.filter(i => typeof i !== 'object').length === 0 ? args : document.querySelectorAll(args[0]);
      this.length = [...this.elements].length;
    }

    each(f) {
      return Array.from(this.elements).forEach(f);
    }

    map(f) {
      return Array.from(this.elements).map(f);
    }

    filter(f) {
      return Array.from(this.elements).filter(f);
    }

    hasClass() {
      if (this.length === 0) {
        return false;
      } else if (this.length === 1) {
        return this.elements[0].classList.contains(...arguments);
      }
      return this.filter(i => i.classList.contains(...arguments)).length === this.length;
    }

    addClass() {
      this.each(i => i.classList.add(...arguments));
    }

    removeClass() {
      this.each(i => i.classList.remove(...arguments));
    }

    html(...args) {
      if (args.length > 0) this.each(i => i.innerHTML = args.join(' '));
      return this.length === 1 ? this.elements[0].innerHTML : this.map(i => i.innerHTML);
    }

    content(...args) {
      if (args.length > 0) this.each(i => i.textContent = args.join(' '));
      return this.length === 1 ? this.elements[0].textContent : this.map(i => i.textContent);
    }

    css(prop, val) {
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

    style(a) {
      return this.length === 1 ? window.getComputedStyle(this.elements[0], null)[a] : this.map(i => window.getComputedStyle(i, null)[a]);
    }

    attr(attr, val) {
      if (val) {
        this.each(i => i.setAttribute(attr, val));
        return this;
      }
      return this.length === 1 ? this.elements[0].getAttribute(attr) : this.map(i => i.getAttribute(attr));
    }
    on() {
      return this.each(i => i.addEventListener(...arguments));
    }
  }


  return Object.assign((...args) => new BrightJs(...args), proto);
})();
