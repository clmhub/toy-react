import {createElement, Component, render} from "./toy-react.js"

class MyComponent extends Component {
    render() {
        return <div>
            <h1>My Component</h1>
            {this.children}
            </div>
    }
}

render(<MyComponent id="a" class="c">
    <div/>
    <div/>
    <div>222
        <div>333</div>
    </div>
</MyComponent>, document.body)

