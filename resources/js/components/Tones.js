import React, { Component } from 'react'
import { Modal, TextContainer } from "@shopify/polaris"

export class Tones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tone: typeof this.props.data.tone == "undefined" ? "": this.props.data.tone,
            style: {
                titleSize:  typeof this.props.data.titleSize == "undefined" ? "1.4rem": this.props.data.titleSize
            }
        }
        this.getDefaultTone();
    }

    getDefaultTone() {
        axios.get(this.props.data.server + '/shop-tones/' + this.props.data.shop)
            .then((response) => {
                if (response.data == null || response.data == "") {
                    this.setDefaultTone();
                } else {
                    if(this.state.tone == ""){
                        this.setState({
                            tone: response.data
                        })
                    }
                }
            })
    }

    setDefaultTone() {
        axios.get(this.props.data.server + "/shop-default-tone/" + this.props.data.shop)
            .then(response => {
                this.getDefaultTone();
            })
    }

    render() {
        return (
            <div className="row tones">
                <div className="col-md-12 col-sm-12 col-12 pl-0 mb-3">
                    <p style={{ color: "#000000", fontWeight:"600", fontSize: this.state.style.titleSize }}>Choose A Tone</p>
                </div>

                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button setting-item-mob-padding">
                    <div className={this.state.tone == "friendly" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} onClick={() => {
                            this.setState({
                                tone:"friendly"
                            })
                             this.props.data.setTone("friendly");
                        }} type="button" className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Friendly</span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button">
                    <div className={this.state.tone == "luxury" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} onClick={() => {
                            this.setState({
                                tone:"luxury"
                            })
                            this.props.data.setTone("luxury");
                        }} type="button" className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Luxury</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button setting-item-mob-padding">
                    <div className={this.state.tone == "relaxed" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} onClick={() => {
                            this.setState({
                                tone:"relaxed"
                            })
                            this.props.data.setTone("relaxed");
                        }} type="button" className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Relaxed</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button">
                    <div className={this.state.tone == "professional" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"professional"
                            })
                           this.props.data.setTone("professional");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Professional</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button setting-item-mob-padding">
                    <div className={this.state.tone == "bold" ? "selected-tone" : ""}>

                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"bold"
                            })
                             this.props.data.setTone("bold");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Bold</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button">
                    <div className={this.state.tone == "adventurous" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"adventurous"
                            })
                            this.props.data.setTone("adventurous");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Adventurous</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button setting-item-mob-padding">
                    <div className={this.state.tone == "witty" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"witty"
                            })
                            this.props.data.setTone("witty");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Witty</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button">
                    <div className={this.state.tone == "persuasive" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"persuasive"
                            })
                            this.props.data.setTone("persuasive");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Persuasive</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-6 pl-md-0 pl-0 mb-4 setting-tone-button setting-item-mob-padding">
                    <div className={this.state.tone == "respectful" ? "selected-tone" : ""}>
                        <button style={{ border: "2px solid" }} type="button" onClick={() => {
                            this.setState({
                                tone:"respectful"
                            })
                            this.props.data.setTone("respectful");
                        }} className="Polaris-Button Polaris-Button--outline Polaris-Button--monochrome Polaris-Button--sizeLarge">
                            <span className="Polaris-Button__Content">
                                <span style={{ fontWeight: "600" }} className="Polaris-Button__Text">Respectful</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tones
