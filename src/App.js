import React from 'react';
import PropTypes from 'prop-types';

class ComputedInput extends React.Component {
    static get propTypes() {
        return {
            syncValue: PropTypes.func.isRequired,
            value: PropTypes.any,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isUgly: false,
            value: props.value,
        };
        this.onChangeIsUgly = this.onChangeIsUgly.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillMount() {
        console.log('componentWillMount');
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        if (this.props.value !== nextProps.value) {
            // reconcile child state with parent state
            this.setState({ value: nextProps.value });
        }
    }

    onChangeIsUgly(event) {
        // set value locally; parent does not care about isUgly
        this.setState({ isUgly: event.target.checked });
    }

    onChangeValue(event) {
        // sync value to parent rather than this.setState()
        this.props.syncValue(event.target.value);
    }

    render() {
        return (
            <div>
                <input
                  type="text"
                  name="computed-input-value"
                  value={this.state.value || ''}
                  onChange={this.onChangeValue}
                />
                <input
                  type="checkbox"
                  name="computed-input-is-ugly"
                  checked={this.state.isUgly || false}
                  onChange={this.onChangeIsUgly}
                />
                <div style={{ backgroundColor: '#EEEEEE' }}>
                    <code>{JSON.stringify(this.state)}</code>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'string' };
    }

    render() {
        return (
            <div style={{ padding: '10px', color: 'white', backgroundColor: 'steelblue' }}>
                <div style={{ color: 'black', backgroundColor: 'white' }}>
                    <ComputedInput
                      syncValue={(newValue) => this.setState({value: newValue})}
                      value={this.state.value}
                    />
                </div>
                <code>{JSON.stringify(this.state)}</code>
            </div>
        );
    }
}

export default App;
