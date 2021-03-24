import React, { Component } from 'react'
import { Modal, TextContainer } from "@shopify/polaris"
import Format from "./Format";
import SampleCopy from "./SampleCopy"


// this class is holding the component to show format, tone, industry editing option for 
//individual product..


export class FormatSelfEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "for-format",
            defaultFormat: this.props.data.format,
            tone: this.props.data.tone,
        }
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            active: updatedProps.data.active
        })
    }

    setFormat(formatSelected) {
        this.setState({
            defaultFormat: formatSelected
        })
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.state.active == "for-format"}
                    onClose={() => { this.props.data.closeSelfModal() }}
                    primaryAction={{
                        content: 'Update',
                        onAction: () => {
                            if (this.state.defaultFormat != "") {
                                this.props.data.setFormat(this.state.defaultFormat);
                            }

                            this.props.data.closeSelfModal()
                        },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => { this.props.data.closeSelfModal() },
                        },
                    ]}
                >
                    <div className="self-edit-modal" style={{padding:" 10px"}}>
                        <Format data={{
                            setFormat: this.setFormat.bind(this),
                            server: this.props.data.server,
                            shop: this.props.data.shop,
                            stateToken: this.props.data.stateToken,
                            defaultFormat: this.state.defaultFormat,
                            titleSize: "16px"
                        }}></Format>
                    </div>
                    <div>
                        <SampleCopy data={{
                              server: this.props.data.server,
                              tone: this.state.tone,
                              format: this.state.defaultFormat,
                        }}>

                        </SampleCopy>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default FormatSelfEdit
