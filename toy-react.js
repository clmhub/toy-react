const RENDER_TO_DOM = Symbol("render to dom");

export function createElement(type, attributes, ...children) {

    let ele;

    if (typeof type === "string") {
        ele = new ElementWrapper(type);
    } else {
        ele = new type;
    }

    for (const attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            const val = attributes[attr];
            ele.setAttribute(attr, val);
        }
    }

    let insertChild = (children) => {
        for (const child of children) {
            if (child === null) {
                continue;
            }
            if (typeof child === "string") {
                ele.appendChild(new TextWrapper(child));
            } else if (typeof child === "object" && child instanceof Array) {
                insertChild(child);
            } else {
                ele.appendChild(child);
            }
        }

    }
    insertChild(children);

    return ele;
}

export class Component {
    constructor() {
        this.props = Object.create(null); //创建一个绝对空的一个对象
        this.children = [];
        this._root = null;
        this._range = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component);
    }

    get vdom() {
        return this.render().vdom;
    }

    //range 位置
    [RENDER_TO_DOM](range) {
        this._range = range;
        this.render()[RENDER_TO_DOM](range);
    }

    rerender() {
        let oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer, oldRange.startOffset);
        range.setEnd(oldRange.startContainer, oldRange.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer, range.endOffset);
        oldRange.deleteContents();
    }

    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState;
            this.rerender();
            return;
        }

        let merge = (oldState, newState) => {
            for (const p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState);
        this.rerender();
    }
    //从取一个元素，变成把它渲染进一个range里面
/*     get root() {
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }
 */}


class ElementWrapper extends Component{
    constructor(type) {
        super(type);
        this.type = type;
        this.root = document.createElement(type);
    }

    /*
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
        } else {
            if (name === "className") {
                this.root.setAttribute("class", value);
            } else {
                this.root.setAttribute(name, value);
            }
        }
    }

    appendChild(component) {
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        range.deleteContents();
        component[RENDER_TO_DOM](range);
    }
*/
    get vdom() {
        return {
            type: this.type,
            props: this.props,
            children: this.children.map(child => child.vdom) //这个语法是什么意思？
        }
    }
    
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }

}

class TextWrapper extends Component{
    constructor(content) {
        super(content);
        this.content = content;
        this.root = document.createTextNode(content);
    }

    get vdom() {
        return {
            type: "#text",
            content: this.content
        }
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }

}


export function render(component, parentElement) {
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}