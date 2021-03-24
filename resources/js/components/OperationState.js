import React, { Component } from 'react'
import { Icon, DisplayText } from "@shopify/polaris"
import {
    ProductsMajor
} from '@shopify/polaris-icons';
import { optimizingArrowOne, optimizingStateOne, down_arrow, optimizingArrowTwo, optimizingStateTwoPath } from "./IconSvg";

export class OperationState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationState: this.props.data.operationState
        }
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            operationState: updatedProps.data.operationState
        })
    }

    operationStateChange(toState) {
        if (toState < this.state.operationState.optimize) {
            this.props.data.stateChange('optimize', toState, this.props.data.optimizingProduct)
        }
    }

    render() {
        let state = this.state.operationState.optimize;
        return (
            <div className="row pl-0">
                <div onClick={() => { this.operationStateChange(1) }} className="cursor-pointer col-md-4 mb-1 col-mb-3 col-sm-4 col-12 pl-0 mt-md-0 mt-3 position-relative">
                    {optimizingStateOne()}
                    <p className="step-indicator">
                        <span className="color-royalb">Step 1:</span> Pick Product
                    </p>
                    <div className={state / 2 >= 1 ? "arrow-icon arrow-icon-fill-light-blue" : "arrow-icon arrow-icon-fill-grey"}>
                        {optimizingArrowOne()}
                    </div>

                    {down_arrow()}

                </div>
                <div onClick={() => { this.operationStateChange(2) }} className="cursor-pointer col-md-4 mb-1 col-mb-3 col-sm-4 col-12 pl-0 mt-md-0 mt-3 position-relative">
                    <svg className={state / 2 >= 1 ? "operation-svg operation-svg-active" : "operation-svg operation-svg-deactive"} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        {optimizingStateTwoPath()}
                    </svg>
                    <p className={state / 2 >= 1 ? "step-indicator" : "step-indicator opacity-5"}>
                        <span className={state / 2 >= 1 ? "color-royalb" : ""}>Step 2: </span> Current Description
                    </p>
                    <div className={state / 3 >= 1 ? "arrow-icon2 arrow-icon-fill-light-blue " : "arrow-icon2 arrow-icon-fill-grey"}>
                        {optimizingArrowTwo()}
                    </div>

                    {down_arrow()}
                </div>
                <div className="col-md-4 mb-1 col-mb-3 col-sm-4 col-12 pl-0 mt-md-0 mt-3 pr-0">
                    <div className="float-md-right">
                        <svg className={state == 3 ? "operation-svg operation-svg-active" : "operation-svg operation-svg-deactive"} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.5A1.5 1.5 0 011.5 0h17A1.5 1.5 0 0120 1.5v6A1.5 1.5 0 0118.5 9h-5.889a1.5 1.5 0 01-1.5-1.5V5.111a1.111 1.111 0 10-2.222 0V7.5a1.5 1.5 0 01-1.5 1.5H1.5A1.5 1.5 0 010 7.5v-6z" fill="#5C5F62" /><path d="M7 5a3 3 0 016 0v4.384a.5.5 0 00.356.479l2.695.808a2.5 2.5 0 011.756 2.748l-.633 4.435A2.5 2.5 0 0114.699 20H6.96a2.5 2.5 0 01-2.27-1.452l-2.06-4.464a2.417 2.417 0 01-.106-1.777c.21-.607.719-1.16 1.516-1.273 1.035-.148 2.016.191 2.961.82V5zm3-1a1 1 0 00-1 1v7.793c0 1.39-1.609 1.921-2.527 1.16-.947-.784-1.59-.987-2.069-.948a.486.486 0 00.042.241l2.06 4.463A.5.5 0 006.96 18h7.74a.5.5 0 00.494-.43l.633-4.434a.5.5 0 00-.35-.55l-2.695-.808A2.5 2.5 0 0111 9.384V5a1 1 0 00-1-1z" fill="#5C5F62" />
                        </svg>
                        <p className={state == 3 ? "step-indicator" : "step-indicator opacity-5"}><span className={state == 3 ? "color-royalb" : ""}>Step 3: </span>Brainstorm and Publish</p>
                    </div>
                </div>

            </div>
        )
    }
}

export default OperationState
