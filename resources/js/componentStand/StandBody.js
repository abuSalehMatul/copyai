import React, { Component } from 'react'
import { Button, TextField, Frame } from "@shopify/polaris";

export class StandBody extends Component {
    constructor(props) {
        super(props)
        this.server = window.location.origin;   /// server to interact with
        this.state = {
            myshopifyDomain: "",
            loading: 0,
            errors: ""
        }
    }

    submitStore() {
        axios.post(this.server + "/get-oauth", {
            'shop': this.state.myshopifyDomain,
        })
            .then((response) => {
                if (response.data != "installed") window.location = response.data
                this.setState({
                    loading: 0
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="main-fram">
                <div className="mt-5 mb-3">
                    <div className="icon mb-4 mt-5">
                        <svg width="113" height="55" viewBox="0 0 77 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.008 8.784C8.352 8.784 9.24 9.456 9.624 10.776L12.48 9.816C12.192 8.712 11.592 7.776 10.632 7.008C9.672 6.24 8.424 5.832 6.936 5.832C5.208 5.832 3.744 6.432 2.568 7.608C1.392 8.808 0.816 10.296 0.816 12.096C0.816 13.896 1.392 15.384 2.592 16.584C3.792 17.784 5.256 18.36 7.032 18.36C8.496 18.36 9.72 17.976 10.68 17.184C11.64 16.416 12.264 15.48 12.552 14.376L9.744 13.44C9.576 13.992 9.264 14.472 8.832 14.856C8.376 15.24 7.776 15.432 7.032 15.432C6.168 15.432 5.448 15.144 4.872 14.544C4.296 13.944 4.008 13.128 4.008 12.096C4.008 11.088 4.296 10.272 4.872 9.672C5.448 9.096 6.144 8.784 7.008 8.784ZM19.3061 15.456C18.4661 15.456 17.7461 15.168 17.1701 14.568C16.5941 13.992 16.3061 13.152 16.3061 12.096C16.3061 11.04 16.5941 10.224 17.1701 9.624C17.7461 9.048 18.4661 8.736 19.3061 8.736C20.1221 8.736 20.8421 9.048 21.4181 9.624C21.9941 10.224 22.3061 11.04 22.3061 12.096C22.3061 13.152 21.9941 13.992 21.4181 14.568C20.8421 15.168 20.1221 15.456 19.3061 15.456ZM19.3061 5.832C17.5301 5.832 16.0421 6.432 14.8661 7.608C13.6901 8.808 13.1141 10.296 13.1141 12.096C13.1141 13.92 13.6901 15.408 14.8661 16.584C16.0421 17.784 17.5301 18.36 19.3061 18.36C21.0821 18.36 22.5461 17.784 23.7221 16.584C24.8981 15.408 25.4981 13.92 25.4981 12.096C25.4981 10.296 24.8981 8.808 23.7221 7.608C22.5461 6.432 21.0821 5.832 19.3061 5.832ZM30.4298 22.56V16.848C31.1258 17.808 32.2538 18.288 33.8378 18.288C35.4698 18.288 36.8138 17.712 37.8458 16.536C38.8778 15.384 39.4058 13.896 39.4058 12.072C39.4058 10.272 38.9018 8.808 37.9418 7.656C36.9578 6.504 35.6378 5.928 33.9578 5.928C33.0938 5.928 32.3498 6.096 31.7258 6.432C31.0778 6.768 30.6218 7.152 30.3338 7.632V6.192H27.2378V22.56H30.4298ZM36.2618 12.096C36.2618 13.128 35.9738 13.944 35.4218 14.544C34.8698 15.144 34.1738 15.432 33.3338 15.432C32.4698 15.432 31.7738 15.144 31.2218 14.52C30.6458 13.92 30.3818 13.104 30.3818 12.096C30.3818 11.088 30.6458 10.296 31.2218 9.696C31.7738 9.096 32.4698 8.784 33.3338 8.784C34.1738 8.784 34.8698 9.096 35.4218 9.672C35.9738 10.272 36.2618 11.088 36.2618 12.096ZM45.2331 22.656L52.6491 6.192H49.2411L46.3371 13.104L43.1931 6.192H39.6171L44.6331 16.512L41.8491 22.656H45.2331Z" fill="#160647" />
                            <path d="M53.7628 15.816C53.7628 16.492 53.9968 17.038 54.4648 17.506C54.9328 17.974 55.4788 18.182 56.1288 18.182C56.7788 18.182 57.3508 17.974 57.8188 17.506C58.2868 17.038 58.5208 16.492 58.5208 15.816C58.5208 15.166 58.2868 14.62 57.8188 14.152C57.3508 13.684 56.7788 13.45 56.1288 13.45C55.4788 13.45 54.9328 13.684 54.4648 14.152C53.9968 14.62 53.7628 15.166 53.7628 15.816Z" fill="#47BAB7" />
                            <path d="M60.312 14.784C60.312 15.744 60.672 16.584 61.416 17.28C62.16 18 63.144 18.336 64.368 18.336C65.928 18.336 67.08 17.76 67.848 16.584C67.848 17.184 67.872 17.664 67.968 18H70.896C70.8 17.472 70.752 16.848 70.752 16.128V10.32C70.752 9.024 70.32 7.944 69.504 7.104C68.664 6.264 67.368 5.832 65.616 5.832C64.128 5.832 62.952 6.24 62.064 7.008C61.152 7.8 60.648 8.712 60.552 9.72L63.384 10.32C63.432 9.792 63.648 9.336 64.032 8.952C64.416 8.592 64.968 8.4 65.64 8.4C66.264 8.4 66.768 8.544 67.104 8.832C67.44 9.12 67.632 9.504 67.632 9.936C67.632 10.416 67.32 10.704 66.744 10.776L63.84 11.208C62.784 11.376 61.944 11.76 61.296 12.36C60.624 12.984 60.312 13.776 60.312 14.784ZM65.04 15.96C64.56 15.96 64.176 15.84 63.912 15.576C63.624 15.312 63.504 14.976 63.504 14.592C63.504 13.752 63.984 13.248 64.968 13.104L67.632 12.696V13.224C67.632 14.208 67.368 14.904 66.888 15.336C66.408 15.768 65.784 15.96 65.04 15.96ZM76.3815 18V6.192H73.1895V18H76.3815ZM72.8055 2.328C72.8055 2.856 72.9975 3.312 73.3815 3.696C73.7655 4.08 74.2215 4.272 74.7735 4.272C75.3015 4.272 75.7815 4.08 76.1655 3.696C76.5495 3.312 76.7415 2.856 76.7415 2.328C76.7415 1.776 76.5495 1.296 76.1655 0.912C75.7815 0.527999 75.3015 0.335999 74.7735 0.335999C74.2215 0.335999 73.7655 0.551999 73.3815 0.935999C72.9975 1.32 72.8055 1.8 72.8055 2.328Z" fill="#160248" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-center s-welcome">Welcome</p>
                    </div>
                    <div>
                        <p className="text-center s-greeting mt-5 mb-2"> Set The App On Your Store</p>
                    </div>
                    <div>
                        <p className="text-center s-short-des mt-5"> Start optimizing your product description and increase revenue in just 3 simple phase </p>
                    </div>

                </div>

                <div className="form-group take-input-div mb-5">
                    <p className="text-center mb-5"> <i> - Enter Your Store Name To Begin - </i></p>
                    <div className="row m-auto col-md-10 col-sm-10 col-10">
                        <div className="col-md-5 col-sm-5 col-12 pr-0">
                            <TextField value={this.state.myshopifyDomain} error={this.state.errors} onChange={(value) => {
                                this.setState({
                                    myshopifyDomain: value
                                })
                            }}
                                placeholder="Your Store Name"></TextField>
                        </div>

                        <span className="input-store-name-suff">.myshopify.com</span>
                        <div className="col-md-5 col-sm-5 col-12  pr-0">
                            <Button primary loading={this.state.loading == 1} fullWidth onClick={() => {
                                if (this.state.myshopifyDomain.length > 0) {
                                    this.setState({
                                        loading: 1,
                                        errors: ""
                                    })
                                    this.submitStore()
                                }
                                else {
                                    this.setState({
                                        errors: "my shopify domain name needed"
                                    })
                                }
                            }}>
                                Get Started
                        </Button>
                        </div>

                        {/* <button  className="col-md-6 col-sm-6 col-12 p-btn">Get Started</button> */}
                    </div>
                </div>
                <hr></hr>
                <div className="col-md-12 col-sm-12 col-12 step-icon-div">
                    <div className="row m-auto col-md-12 col-sm-12 col-12">
                        <div className="col-md-4 col-sm-4 col-4">
                            <div className="step-svg-container">
                                <svg className="operation-svg operation-svg-active" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.293 1.293A1 1 0 0111 1h7a1 1 0 011 1v7a1 1 0 01-.293.707l-9 9a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414l9-9zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#FFFFFF" />
                                </svg>
                                <div className="mt-5">
                                    <p className="operation-title mb-3">Step 1:</p> 
                                    
                                </div>
                               
                            </div>
                            <p className="text-center">Pick A Product</p>
                        </div>
                        <div className="col-md-4 col-sm-4 col-4">
                            <div className="step-svg-container">
                                <svg className="operation-svg operation-svg-active" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.707 9.707A.996.996 0 003 9V5a1 1 0 011-1 1 1 0 000-2C2.346 2 1 3.346 1 5v3.586l-.707.707a.999.999 0 000 1.414l.707.707V15c0 1.654 1.346 3 3 3a1 1 0 000-2 1 1 0 01-1-1v-4a.996.996 0 00-.293-.707L2.414 10l.293-.293zm17.217-.09a1.001 1.001 0 00-.217-.324L19 8.586V5c0-1.654-1.346-3-3-3a1 1 0 100 2 1 1 0 011 1v4a.997.997 0 00.293.707l.293.293-.293.293A.996.996 0 0017 11v4a1 1 0 01-1 1 1 1 0 100 2c1.654 0 3-1.346 3-3v-3.586l.707-.707a1.001 1.001 0 00.217-1.09zm-7.227-4.333a1.002 1.002 0 00-1.63.346l-3.996 8a.999.999 0 00.56 1.299 1.006 1.006 0 001.302-.557l3.995-8a.997.997 0 00-.23-1.088z" fill="#FFFFFF" />;
                            </svg>
                                <div className="mt-5"><p className="operation-title mb-3">Step 2: </p></div>
                            </div>
                            <p className="text-center">Review Description</p>
                        </div>
                        <div className="col-md-4 col-sm-4 col-4">
                            <div className="step-svg-container">
                                <svg className="display-block operation-svg operation-svg-active" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 1.5A1.5 1.5 0 011.5 0h17A1.5 1.5 0 0120 1.5v6A1.5 1.5 0 0118.5 9h-5.889a1.5 1.5 0 01-1.5-1.5V5.111a1.111 1.111 0 10-2.222 0V7.5a1.5 1.5 0 01-1.5 1.5H1.5A1.5 1.5 0 010 7.5v-6z" fill="#FFFFFF" />
                                    <path d="M7 5a3 3 0 016 0v4.384a.5.5 0 00.356.479l2.695.808a2.5 2.5 0 011.756 2.748l-.633 4.435A2.5 2.5 0 0114.699 20H6.96a2.5 2.5 0 01-2.27-1.452l-2.06-4.464a2.417 2.417 0 01-.106-1.777c.21-.607.719-1.16 1.516-1.273 1.035-.148 2.016.191 2.961.82V5zm3-1a1 1 0 00-1 1v7.793c0 1.39-1.609 1.921-2.527 1.16-.947-.784-1.59-.987-2.069-.948a.486.486 0 00.042.241l2.06 4.463A.5.5 0 006.96 18h7.74a.5.5 0 00.494-.43l.633-4.434a.5.5 0 00-.35-.55l-2.695-.808A2.5 2.5 0 0111 9.384V5a1 1 0 00-1-1z" fill="#FFFFFF" />
                                </svg>
                                <div className="w-100 mt-5"><p className="operation-title mb-3">Step 3: </p></div>
                            </div>
                            <p className="text-center">Brainstorm & Publish</p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default StandBody
