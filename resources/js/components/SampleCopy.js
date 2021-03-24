import React, { Component } from 'react'
import { Button, Spinner } from "@shopify/polaris"


export class SampleCopy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: this.props.data.format,
            tone: this.props.data.tone,
            industry: this.props.data.industry,
            description: ""
        }
        this.getDescription();
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            format: updatedProps.data.format,
            tone: updatedProps.data.tone,
            industry: updatedProps.data.industry
        }, () => { this.getDescription() })
    }

    getDescription() {
        axios.post(this.props.data.server + "/get-sample-copy", {
            "format": this.state.format,
            "tone": this.state.tone,
        })
            .then(response => {
                this.setState({
                    description: response.data
                })
            })
    }

    loadingState() {
        return <div style={{ margin:"auto", width:"6%"}}>
            <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>;
    }

    render() {
        return (
            <div className="col-md-12 col-sm-12 col-12 mb-5 self-edit-modal">
                <p style={{fontSize:"16px", fontWeight:"600"}}>Sample Copy</p>
                <div>
                    
                <p className="mt-3">
                    {this.state.description == "" ? this.loadingState() : this.state.description}
                </p>
                </div>
            </div>

        )
    }
}

export default SampleCopy
