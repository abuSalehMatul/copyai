import React, { Component } from 'react'
import { Select, Modal } from "@shopify/polaris"

export class Format extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formatOptions: [],
            defaultFormat: typeof this.props.data.defaultFormat == "undefined" ? "": this.props.data.defaultFormat,
            server: this.props.data.server,
            shop: this.props.data.shop,
            style: {
                titleSize:  typeof this.props.data.titleSize == "undefined" ? "1.4rem": this.props.data.titleSize
            }
        }
        this.getDefaultFormat();
    }

    getDefaultFormat() {
        axios.get(this.state.server + '/shop-default-format/' + this.props.data.shop)
            .then((response) => {
                this.getFormats();
                if (response.data == null || response.data == "") {
                    this.setDefaultFormat();
                } else {
                    if(this.state.defaultFormat == ""){
                        this.setState({
                            defaultFormat: response.data
                        })
                    }
                   
                }
            })
    }

    setDefaultFormat() {
        axios.post(this.state.server + '/set-shop-default-format', {
            "state_token": this.props.data.stateToken,
        })
            .then((response) => {
                if (response.data == null || response.data == "") {
                    this.setDefaultFormat();
                } else {
                    this.setState({
                        defaultFormat: response.data
                    })
                }
            })
    }

    getFormats() {

        ///get all the options for formats...................
        axios.get(this.state.server + "/format-options")
            .then(response => {
                let options = [];
                let keys = Object.keys(response.data);
                keys.forEach(key => {
                    let data = {};
                    data.label = response.data[key];
                    data.value = key;
                    options.push(data);
                    data = {};
                })

                this.setState({
                    formatOptions: options
                })
                if(typeof this.props.data.completed != "undefined"){
                    console.log('completed')
                    this.props.data.completed();
                }
            })
    }
    render() {
        let title = <div style={{ fontWeight: "600", fontSize: this.state.style.titleSize }}>Select a Format</div>
        return (
            <div>
                <Select
                    label={title}
                    options={this.state.formatOptions}
                    onChange={(value) => {
                        this.setState({
                            defaultFormat: value
                        })
                        this.props.data.setFormat(value);
                    }}
                    value={this.state.defaultFormat}
                />
            </div>
        )
    }
}

export default Format
