"use strict";

import React, {Component, Fragment} from "react";
import {CirclePicker} from "react-color";
export class CircleColor extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(color) {
        this.setState({color});
    }

    render() {
        return (
            <>
                <Fragment>
                    <CirclePicker
                        colors={[
                            "#F94144",
                            "#F3722C",
                            "#F8961E",
                            "#F9844A",
                            "#F9C74F",
                            "#90BE6D",
                            "#43AA8B",
                            "#4D908E",
                            "#577590",
                            "#277DA1",
                        ]}
                        color={this.state.color}
                        onChange={this.handleOnChange}
                    />
                </Fragment>
            </>
        );
    }
}

export default CircleColor;
