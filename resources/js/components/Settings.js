import React, { Component } from 'react'
import { Button, DisplayText, Spinner, Select } from "@shopify/polaris"
import Tones from "./Tones";
import Format from "./Format"

export class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tone: "",
            industrySelected: "",
            industries: "",
            shopDetails: "",
            defaultFormat: "",
            initialLoading: 1,
            style: {
                titleSize: typeof this.props.data.titleSize == "undefined" ? "1.4rem" : this.props.data.titleSize
            }
        }
        this.getDefaultIndustry();
        this.getIndustryOptions();

    }

    setFormat(formatSelected) {
        this.setState({
            defaultFormat: formatSelected
        })
    }

    getDefaultIndustry() {
        axios.get(this.props.data.server + "/get-default-industry/" + this.props.data.shop)
            .then(response => {
                this.setState({
                    industrySelected: response.data
                })
            })
    }

    saveSettings() {
        axios.post(this.props.data.server + "/update-settings/" + this.props.data.shop, {
            'tone': this.state.tone,
            'industry': this.state.industrySelected,
            "default_format": this.state.defaultFormat,
            'my_shopify_domain': this.props.data.shop
        })
            .then(response => {
                this.props.data.toastActivation("Basic", "Settings Updated");
            })
    }

    getIndustryOptions() {
        axios.get(this.props.data.server + '/industry-options')
            .then((response) => {
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
                    industries: options
                })
            })
    }


    setTone(tone) {
        this.setState({
            tone: tone
        })
    }

    completed() {
        console.log('hi')
        this.setState({
            initialLoading: 0
        })
        $("#setting_loader").addClass("hide");
        $("#settings_page").removeClass("hide");
    }

    render() {
        let selectIndustryTitle = <div style={{ fontWeight: "600", fontSize: this.state.style.titleSize }}>Select an Industry</div>

        return (
            <div>
                <div id="setting_loader" className="mt-5">
                    <div style={{ width: "9%" }} className="m-auto mt-5"><Spinner accessibilityLabel="Loading Settings" size="large" /></div>
                </div>
                <div id="settings_page" className="hide">
                    <div>
                        <DisplayText size="large">Settings</DisplayText>
                    </div>
                    <div className="row">
                        <div className="col-md-8 col-sm-8 col-12 pl-md-0 pl-0 row mt-4 pr-md-3 pr-0" style={{ color: '#56b9b4' }}>
                            <Tones data={{
                                server: this.props.data.server,
                                shop: this.props.data.shop,
                                setTone: this.setTone.bind(this),
                                stateToken: this.props.data.stateToken
                            }}></Tones>
                        </div>
                        <div className="col-md-4 col-sm-4 col-12 mt-4 pl-0 pr-0">
                            <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0">
                                <Select
                                    label={selectIndustryTitle}
                                    options={this.state.industries}
                                    onChange={(value) => {
                                        this.setState({
                                            industrySelected: value
                                        })
                                    }}
                                    value={this.state.industrySelected}
                                />
                            </div>
                            <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3">
                                <Format data={{
                                    setFormat: this.setFormat.bind(this),
                                    server: this.props.data.server,
                                    shop: this.props.data.shop,
                                    stateToken: this.props.data.stateToken,
                                    completed: this.completed.bind(this)
                                }}></Format>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0">
                        <div className="col-md-2 col-sm-2 col-6 mt-md-3 mt-5 pl-0 pr-0">
                            <Button onClick={
                                () => { this.saveSettings() }
                            } primary>Save Settings</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings
