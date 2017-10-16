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

        // attempt to auto-detect isUgly
        let isUgly = false;
        // if (
        //     Object.prototype.toString.call(valuePretty) === '[object Array]' ||
        //     Object.prototype.toString.call(valuePretty) === '[object Null]' ||
        //     valuePretty === ''
        // ) {
        //     isUgly = true;
        // }

        // set initial state
        this.state = { hasError, isUgly, valuePretty, valueUgly };

        this.onChangeIsUgly = this.onChangeIsUgly.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        /*
         * NOTE: Intentionally skip (this.props.value !== nextProps.value) for this logic.
         *       That comparision will cause a unique edge case to fail when valueUgly
         *       has been desynchronized from the parent value due to being in an error
         *       state but has finally re-entered a valid state.
         */
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

    renderStatusIcon() {
        /* eslint-disable jsx-a11y/accessible-emoji */
        /* eslint-disable jsx-a11y/href-no-hash */
        return this.state.hasError ? (
            <a
              href="#"
              style={{ textDecoration: 'none' }}
              onClick={(event) => {
                  event.preventDefault();
                  if (typeof window !== 'undefined') {
                      window.alert('error');
                  }
              }}
            >
                &#10071;
            </a>
        ) : (
            <a
              href="#"
              style={{ marginLeft: '5px', textDecoration: 'none' }}
              onClick={(event) => {
                  event.preventDefault();
                  if (typeof window !== 'undefined') {
                      window.alert('information');
                  }
              }}
            >
                &#9432;
            </a>
        );
        /* eslint-enable jsx-a11y/href-no-hash */
        /* eslint-enable jsx-a11y/accessible-emoji */
    }

    renderValueInput() {
        if (this.state.isUgly) {
            return (
                <input
                  type="text"
                  id="computed-input-value"
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
              id="computed-input-value"
              name="computed-input-value"
              value={this.state.valuePretty}
              onChange={this.onChangeValue}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderValueInput()}
                <input
                  type="checkbox"
                  id="computed-input-is-ugly"
                  name="computed-input-is-ugly"
                  checked={this.state.isUgly || false}
                  onChange={this.onChangeIsUgly}
                />
                <label htmlFor="computed-input-is-ugly">
                    ugly
                </label>
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
