import React, { Component } from 'react'
import { Button, Spinner, Select } from "@shopify/polaris"
import { editIcon, cancel, accept } from "./IconSvg"
import ToneSelfEdit from "./ToneSelfEdit";
import FormatSelfEdit from './FormatSelfEdit';

export class SelfSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tone: this.props.data.tone,
            format: this.props.data.format,
            industry: this.props.data.industry,
            showModal: this.props.data.showModal,
            formatOptions: [],
            industryOptions: [],
            industryOptionsPrepared: [],
            showModal: 'close',
            initiatedFrom: this.props.data.initiatedFrom
        }
        this.getFormatOptions();
        this.getIndustryOptions();
        this.handleEventLog = this.handleEventLog.bind(this)
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            format: updatedProps.data.format,
            tone: updatedProps.data.tone,
            industry: updatedProps.data.industry,
            showModal: updatedProps.data.showModal
        })
    }

    getFormatOptions() {
        axios.get(this.props.data.server + "/format-options")
            .then(response => {
                this.setState({
                    formatOptions: response.data
                })
            })
    }

    getIndustryOptions() {
        axios.get(this.props.data.server + "/industry-options")
            .then(response => {
                this.setState({
                    industryOptions: response.data
                })
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
                    industryOptionsPrepared: options
                })
            })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    closeSelfModal() {
        this.setState({
            showModal: "close"
        })
    }

    setTone(tone) {
        this.setState({
            tone: tone,
        })
        this.props.data.changeValues('change-tone', tone);
    }

    setFormat(format) {
        this.setState({
            format: format
        })
        this.props.data.changeValues('change-format', format);
    }

    loadingState() {
        return <div style={{ margin: "auto", width: "6%", marginRight: "10px", float: "right" }}>
            <Spinner accessibilityLabel="Spinner example" size="small" />
        </div>;
    }

    handleEventLog(type) {
        if (this.state.initiatedFrom == "step-2") {
            let eventMessage = "copy_clckd_tunning_stp_2, type:"+type
            gtag('event', eventMessage, {
                'event_category': 'click_on_tunning',
                'event_label': 'two',
            });
        }
    }

    render() {
        let individualEditModal = "";
        if (this.state.showModal == "for-tone") {
            individualEditModal = <ToneSelfEdit onClick={this.handleEventLog('tone')} data={{
                server: this.props.data.server,
                shop: this.props.data.shop,
                format: this.state.format,
                tone: this.state.tone,
                setTone: this.setTone.bind(this),
                closeSelfModal: this.closeSelfModal.bind(this),
                stateToken: this.props.data.stateToken,
                active: this.state.showModal
            }}></ToneSelfEdit>
        }
        if (this.state.showModal == "for-format") {
            individualEditModal = <FormatSelfEdit onClick={this.handleEventLog('format')} data={{
                server: this.props.data.server,
                shop: this.props.data.shop,
                format: this.state.format,
                tone: this.state.tone,
                setFormat: this.setFormat.bind(this),
                closeSelfModal: this.closeSelfModal.bind(this),
                stateToken: this.props.data.stateToken,
                active: this.state.showModal
            }}></FormatSelfEdit>
        }

        return (
            <div>
                {individualEditModal}
                <div className="row col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3">
                    <div className="col-md-4 col-sm-4 col-3 pl-0 pr-0 font-weight-600" style={{ fontSize: "15px" }}>Tone:</div>
                    <div className="col-md-7 col-sm-7 col-7 pl-0 pr-0 text-right color-greenis font-we-600" >
                        {this.state.tone == "" ? this.loadingState() : this.capitalizeFirstLetter(this.state.tone)}
                    </div>
                    <div className="col-md-1 col-sm-1 col-2 pl-0 pr-0 float-right">
                        <div className="text-right eidt-icon-in-step-2 cursor-pointer" onClick={() => {
                            this.setState({
                                showModal: "for-tone"
                            })
                        }}>{editIcon()}</div>
                    </div>

                </div>
                <div className="row col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3">
                    <div className="col-md-4 col-sm-4 col-3 pl-0 pr-0 font-weight-600" style={{ fontSize: "15px" }}>Format:</div>
                    <div className="col-md-7 col-sm-7 col-7 pl-0 pr-0 text-right color-greenis font-we-600" >
                        {this.state.formatOptions.length == 0 ? this.loadingState() : this.state.formatOptions[this.state.format]}

                    </div>
                    <div className="col-md-1 col-sm-1 col-2 pl-0 pr-0 float-right">
                        <div className="text-right eidt-icon-in-step-2 cursor-pointer" onClick={() => {
                            this.setState({
                                showModal: "for-format"
                            })
                        }}>{editIcon()}</div>
                    </div>

                </div>
                <div className="row col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3">
                    <div className="col-md-4 col-sm-4 col-3 pl-0 pr-0 font-weight-600" style={{ fontSize: "15px" }}>Industry:</div>
                    {this.state.showModal != "for-industry" ?
                        <div className="col-md-8 col-sm-9 col-9 pl-0 pr-0 row">
                            <div className="col-md-11 col-sm-11 col-10 pl-0 pr-md-3 pr-sm-3 pr-4 text-right color-greenis font-we-600" >
                                {this.state.industryOptions.length == 0 ? this.loadingState() : this.state.industryOptions[this.state.industry]}
                            </div>
                            <div className="col-md-1 col-sm-1 col-2 pl-0 pr-0 float-right">
                                <div className="text-right eidt-icon-in-step-2 float-right cursor-pointer" onClick={() => {
                                    this.setState({
                                        showModal: "for-industry"
                                    })
                                }}>{editIcon()}</div>
                            </div>
                        </div>
                        :

                        <div className="col-md-8 col-sm-8 col-9 pl-0 pr-0 row">
                            <div className="col-md-9 col-sm-8 col-8 pl-0 pr-0">
                                <Select
                                    options={this.state.industryOptionsPrepared}
                                    onClick={this.handleEventLog('industry')}
                                    onChange={(value) => {
                                        this.setState({
                                            industry: value
                                        })
                                        this.props.data.changeValues('change-industry', value);
                                    }}
                                    value={this.state.industry}
                                />
                            </div>
                            <div className="col-md-3 col-sm-2 col-4 pl-0 pr-0 float-right row">
                                <div className="text-right eidt-icon-in-step-2 pl-2 cursor-pointer" onClick={() => {
                                    this.setState({
                                        showModal: "close"
                                    })
                                }}>{accept()}</div>
                                <div className="text-right eidt-icon-in-step-2 pl-3 cursor-pointer" onClick={() => {
                                    this.setState({
                                        showModal: "close"
                                    })
                                }}>{cancel()}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default SelfSelect
