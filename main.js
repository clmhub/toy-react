import { createElement, Component, render } from "./toy-react.js"

class MyComponent extends Component {
    constructor() {
        super();
        this.state = {
            a: 1,
            b: 2
        }
    }
    render() {
        return <div>
            <h1>My Component</h1>
            <span>{this.state.a.toString()}</span>
            <span>{this.state.b.toString()}</span>
            <button onclick={() => { this.setState({ a: this.state.a + 1 }) }}>add</button>
            {this.children}
        </div>
    }
}

render(<MyComponent id="a" class="c">
    <div />
    <div />
    <div>
        222
        <div>333</div>
    </div>
    <div>
    </div>
</MyComponent>, document.body)

