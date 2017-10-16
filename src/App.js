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

        // calculate initial state
        const valuePretty = this.props.value;
        let hasError = false;
        let valueUgly;
        try {
            valueUgly = JSON.stringify(valuePretty);
        } catch (e) {
            hasError = true;
        }
        // set initial state
        this.state = { hasError, isUgly: false, valuePretty, valueUgly };

        this.onChangeIsUgly = this.onChangeIsUgly.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            // re-calculate state
            const valuePretty = nextProps.value;
            let hasError = false;
            let valueUgly;
            try {
                valueUgly = JSON.stringify(valuePretty);
            } catch (e) {
                hasError = true;
            }
            // update state
            this.setState({ hasError, valuePretty, valueUgly });
        }
    }

    onChangeIsUgly(event) {
        this.setState({ isUgly: event.target.checked });
    }

    onChangeValue(event) {
        if (this.state.isUgly) {
            try {
                // parse ugly value and synchronize to parent
                this.props.syncValue(JSON.parse(event.target.value));
            } catch (e) {
                // failed parse and synchronize; update own state
                this.setState({ hasError: true, valueUgly: event.target.value });
            }
        } else {
            // synchronize pretty value to parent
            this.props.syncValue(event.target.value);
        }
    }

    renderValueInput() {
        if (this.state.isUgly) {
            return (
                <input
                  type="text"
                  name="computed-input-value"
                  value={this.state.valueUgly}
                  onChange={this.onChangeValue}
                />
            );
        }
        // else
        return (
            <input
              type="text"
              name="computed-input-value"
              value={this.state.valuePretty}
              onChange={this.onChangeValue}
            />
        );
    }

    renderStatusIcon() {
        return this.state.hasError ? (
            <span
              aria-label="error"
              role="img"
              style={{ textDecoration: 'none' }}
              onClick={() => { if (typeof window !== 'undefined') {window.alert('error');} }}
            >
                &#10071;
            </span>
        ) : (
            <span
              aria-label="information"
              role="img"
              style={{ textDecoration: 'none' }}
              onClick={() => { if (typeof window !== 'undefined') {window.alert('information');} }}
            >
                &#9432;
            </span>
        );
    }

    render() {
        return (
            <div>
                {this.renderValueInput()}
                <input
                  type="checkbox"
                  name="computed-input-is-ugly"
                  checked={this.state.isUgly || false}
                  onChange={this.onChangeIsUgly}
                />
                {this.renderStatusIcon()}
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
        this.state = { showComputedInput: true, value: 'string' };
    }

    render() {
        return (
            <div style={{ padding: '10px', color: 'white', backgroundColor: 'steelblue' }}>
                {this.state.showComputedInput ? (
                    <div style={{ color: 'black', backgroundColor: 'white' }}>
                        <ComputedInput
                          syncValue={(newValue) => this.setState({value: newValue})}
                          value={this.state.value}
                        />
                    </div>
                ) : (
                    <div>ComputedInput is hidden</div>
                )}
                <div style={{ marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={() => this.setState({ showComputedInput: !this.state.showComputedInput })}
                    >
                        Toggle ComputedInput
                    </button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <code>{JSON.stringify(this.state)}</code>
                </div>
            </div>
        );
    }
}

export default App;
