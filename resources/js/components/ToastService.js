import React, { Component } from 'react'
import { Toast } from "@shopify/polaris"

export class ToastService extends Component {
    constructor(props){
        super(props)
        this.state = {
            messageType: this.props.data.toastType,
            message: this.props.data.toastMessage,
        }
    }
    componentWillReceiveProps(updatedProps){
        this.setState({
            messageType: updatedProps.data.toastType,
            message: updatedProps.data.toastMessage
        })
    }
    render() {
        return (
            <div>
                 <Toast content={this.state.message} error={this.state.messageType != "Basic"} onDismiss={()=>{this.props.data.toastDismis()}} />
            </div>
        )
    }
}

export default ToastService
