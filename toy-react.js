export function createElement (type, attributes, ...children) {

    let ele;

    if (typeof type === "string") {
        ele = new ElementWrapper(type);
    } else {
        ele = new type;
    }
    
    for (const attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            const val = attributes[attr];
            ele.setAttribute(attr,val);
        }
    }

    let insertChild = (children) => {
        for (const child of children) {
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

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name,value);
    }

    appendChild(component) {
        this.root.appendChild(component.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null); //创建一个绝对空的一个对象
        this.children = [];
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component);
    }

    get root() {
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }
}

export function render(component, parentElement) {
    parentElement.appendChild(component.root);
}