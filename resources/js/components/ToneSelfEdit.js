import React, { Component } from 'react'
import { Modal, TextField } from "@shopify/polaris"
import Tones from "./Tones"
import SampleCopy from "./SampleCopy"

export class ToneSelfEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "for-tone",
            tone: this.props.data.tone,
            format: this.props.data.format,
        }
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            active: updatedProps.data.active
        })
    }

    setTone(tone) {
        this.setState({
            tone: tone
        });
        
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.state.active == "for-tone"}
                    onClose={() => { this.props.data.closeSelfModal() }}
                    primaryAction={{
                        content: 'Update',
                        onAction: () => { 
                            if(this.state.tone != ""){
                                this.props.data.setTone(this.state.tone);
                            }
                           
                            this.props.data.closeSelfModal();
                        },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => { this.props.data.closeSelfModal() },
                        },
                    ]}
                >
                    <div className="self-edit-modal" style={{ color: '#56b9b4' }}>
                        <Tones data={{
                            server: this.props.data.server,
                            shop: this.props.data.shop,
                            setTone: this.setTone.bind(this),
                            tone: this.state.tone,
                            stateToken: this.props.data.stateToken,
                            titleSize: "16px"
                        }}></Tones>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default ToneSelfEdit
