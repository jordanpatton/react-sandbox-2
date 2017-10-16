import React from 'react';
import PropTypes from 'prop-types';

class ComputedInput extends React.Component {
    static get propTypes() {
        return {
            syncValue: PropTypes.func.isRequired,
            value: PropTypes.any.isRequired,
        };
    }

    constructor(props) {
        super(props);
        this.state = { isUgly: false };
        this.onChangeIsUgly = this.onChangeIsUgly.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillMount() {
        console.log('componentWillMount');
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
    }

    onChangeIsUgly(event) {
        this.setState({ isUgly: event.target.checked });
    }

    onChangeValue(event) {
        this.props.syncValue(event.target.value);
    }

    renderValueInput() {
        let buffer;
        let hasError = false;

        if (this.state.isUgly) {
            let valueUgly;
            try {
                valueUgly = JSON.stringify(this.props.value);
            } catch (e) {
                hasError = true;
            }
            buffer = (
                <input
                  type="text"
                  name="computed-input-value"
                  value={valueUgly}
                  onChange={this.onChangeValue}
                />
            );
        } else {
            buffer = (
                <input
                  type="text"
                  name="computed-input-value"
                  value={this.props.value}
                  onChange={this.onChangeValue}
                />
            );
        }

        return { buffer, hasError };
    }

    render() {
        const {
            buffer: valueInputBuffer,
            hasError: valueInputHasError,
        } = this.renderValueInput();

        return (
            <div>
                {valueInputBuffer}
                <input
                  type="checkbox"
                  name="computed-input-is-ugly"
                  checked={this.state.isUgly || false}
                  onChange={this.onChangeIsUgly}
                />
                {valueInputHasError ? (
                    <span style={{ textDecoration: 'none' }}>&#10071;</span>
                ) : (
                    <span style={{ textDecoration: 'none' }}>&#9432;</span>
                )}
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
