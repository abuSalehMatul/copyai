import React, { Component } from 'react'
import { Button, Spinner, Frame } from "@shopify/polaris";


export class ProductSyncing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            totalProducts: "All",
            completedProducts: 0,
            remainingTime: 450
        }
        this.interval = "";
        this.getData();
        // Echo.channel('product-uploaded-to-'+this.props.data.shop)
        // .listen('ProductUploadedToDb', (e)=>{
        //     console.log(e);
        //     if(e.shop == this.props.data.shop){
        //         this.setState({
        //             completedProducts: e.currentNumUploaded,
        //             totalProducts: e.total,
        //             remainingTime: Math.ceil(e.remainingTime)
        //         })

        //     }
        // })
    }

    reloadTheApp() {
        document.location.href = "/getEmbedded?shop";
    }

    getData() {
        this.callPoll();
    }

    callPoll() {
        //let that = this;
        axios.get(this.props.data.server + "/get-product-upload-meta/" + this.props.data.stateToken)
            .then(response => {
                console.log(response.data.current_importing);
                if (response.data.current_importing === response.data.initial_total_product && typeof response.data.initial_total_product != "undefined") {
                    if (typeof response.data.current_importing != 'undefined') {
                        this.setState({
                            completedProducts: response.data.current_importing,
                            totalProducts: response.data.initial_total_product,
                            remainingTime: Math.ceil(response.data.initial_product_import_remaining_time)
                        })
                    }

                } else {
                    if (typeof response.data.current_importing != 'undefined') {
                        this.setState({
                            completedProducts: response.data.current_importing,
                            totalProducts: response.data.initial_total_product,
                            remainingTime: Math.ceil(response.data.initial_product_import_remaining_time)
                        })
                    }
                    setTimeout(() => {
                        this.callPoll();
                    }, 3000)
                }
            })
    }

    render() {
        // console.log(this.state.totalProducts);
        // console.log(this.state.completedProducts);
        // console.log(this.state.completedProducts == this.state.totalProducts)
        let minute;
        let second;
        if (this.state.remainingTime > 60) {
            minute = Math.floor(this.state.remainingTime / 60);
            if (minute < 2) {
                minute = minute + " minute";
            } else {
                minute = minute + " minutes"
            }
            second = this.state.remainingTime % 60;
            if (second < 2) {
                second = second + " second"
            } else {
                second = second + " seconds"
            }
        } else {
            minute = "";
            second = this.state.remainingTime + " seconds"
        }
        return (
            <div className="main-fram">
                <div className="mt-5 mb-3">
                    <div className="syncing-icon mb-4 mt-5">
                        <svg width="113" height="55" viewBox="0 0 77 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.008 8.784C8.352 8.784 9.24 9.456 9.624 10.776L12.48 9.816C12.192 8.712 11.592 7.776 10.632 7.008C9.672 6.24 8.424 5.832 6.936 5.832C5.208 5.832 3.744 6.432 2.568 7.608C1.392 8.808 0.816 10.296 0.816 12.096C0.816 13.896 1.392 15.384 2.592 16.584C3.792 17.784 5.256 18.36 7.032 18.36C8.496 18.36 9.72 17.976 10.68 17.184C11.64 16.416 12.264 15.48 12.552 14.376L9.744 13.44C9.576 13.992 9.264 14.472 8.832 14.856C8.376 15.24 7.776 15.432 7.032 15.432C6.168 15.432 5.448 15.144 4.872 14.544C4.296 13.944 4.008 13.128 4.008 12.096C4.008 11.088 4.296 10.272 4.872 9.672C5.448 9.096 6.144 8.784 7.008 8.784ZM19.3061 15.456C18.4661 15.456 17.7461 15.168 17.1701 14.568C16.5941 13.992 16.3061 13.152 16.3061 12.096C16.3061 11.04 16.5941 10.224 17.1701 9.624C17.7461 9.048 18.4661 8.736 19.3061 8.736C20.1221 8.736 20.8421 9.048 21.4181 9.624C21.9941 10.224 22.3061 11.04 22.3061 12.096C22.3061 13.152 21.9941 13.992 21.4181 14.568C20.8421 15.168 20.1221 15.456 19.3061 15.456ZM19.3061 5.832C17.5301 5.832 16.0421 6.432 14.8661 7.608C13.6901 8.808 13.1141 10.296 13.1141 12.096C13.1141 13.92 13.6901 15.408 14.8661 16.584C16.0421 17.784 17.5301 18.36 19.3061 18.36C21.0821 18.36 22.5461 17.784 23.7221 16.584C24.8981 15.408 25.4981 13.92 25.4981 12.096C25.4981 10.296 24.8981 8.808 23.7221 7.608C22.5461 6.432 21.0821 5.832 19.3061 5.832ZM30.4298 22.56V16.848C31.1258 17.808 32.2538 18.288 33.8378 18.288C35.4698 18.288 36.8138 17.712 37.8458 16.536C38.8778 15.384 39.4058 13.896 39.4058 12.072C39.4058 10.272 38.9018 8.808 37.9418 7.656C36.9578 6.504 35.6378 5.928 33.9578 5.928C33.0938 5.928 32.3498 6.096 31.7258 6.432C31.0778 6.768 30.6218 7.152 30.3338 7.632V6.192H27.2378V22.56H30.4298ZM36.2618 12.096C36.2618 13.128 35.9738 13.944 35.4218 14.544C34.8698 15.144 34.1738 15.432 33.3338 15.432C32.4698 15.432 31.7738 15.144 31.2218 14.52C30.6458 13.92 30.3818 13.104 30.3818 12.096C30.3818 11.088 30.6458 10.296 31.2218 9.696C31.7738 9.096 32.4698 8.784 33.3338 8.784C34.1738 8.784 34.8698 9.096 35.4218 9.672C35.9738 10.272 36.2618 11.088 36.2618 12.096ZM45.2331 22.656L52.6491 6.192H49.2411L46.3371 13.104L43.1931 6.192H39.6171L44.6331 16.512L41.8491 22.656H45.2331Z" fill="#160647" />
                            <path d="M53.7628 15.816C53.7628 16.492 53.9968 17.038 54.4648 17.506C54.9328 17.974 55.4788 18.182 56.1288 18.182C56.7788 18.182 57.3508 17.974 57.8188 17.506C58.2868 17.038 58.5208 16.492 58.5208 15.816C58.5208 15.166 58.2868 14.62 57.8188 14.152C57.3508 13.684 56.7788 13.45 56.1288 13.45C55.4788 13.45 54.9328 13.684 54.4648 14.152C53.9968 14.62 53.7628 15.166 53.7628 15.816Z" fill="#47BAB7" />
                            <path d="M60.312 14.784C60.312 15.744 60.672 16.584 61.416 17.28C62.16 18 63.144 18.336 64.368 18.336C65.928 18.336 67.08 17.76 67.848 16.584C67.848 17.184 67.872 17.664 67.968 18H70.896C70.8 17.472 70.752 16.848 70.752 16.128V10.32C70.752 9.024 70.32 7.944 69.504 7.104C68.664 6.264 67.368 5.832 65.616 5.832C64.128 5.832 62.952 6.24 62.064 7.008C61.152 7.8 60.648 8.712 60.552 9.72L63.384 10.32C63.432 9.792 63.648 9.336 64.032 8.952C64.416 8.592 64.968 8.4 65.64 8.4C66.264 8.4 66.768 8.544 67.104 8.832C67.44 9.12 67.632 9.504 67.632 9.936C67.632 10.416 67.32 10.704 66.744 10.776L63.84 11.208C62.784 11.376 61.944 11.76 61.296 12.36C60.624 12.984 60.312 13.776 60.312 14.784ZM65.04 15.96C64.56 15.96 64.176 15.84 63.912 15.576C63.624 15.312 63.504 14.976 63.504 14.592C63.504 13.752 63.984 13.248 64.968 13.104L67.632 12.696V13.224C67.632 14.208 67.368 14.904 66.888 15.336C66.408 15.768 65.784 15.96 65.04 15.96ZM76.3815 18V6.192H73.1895V18H76.3815ZM72.8055 2.328C72.8055 2.856 72.9975 3.312 73.3815 3.696C73.7655 4.08 74.2215 4.272 74.7735 4.272C75.3015 4.272 75.7815 4.08 76.1655 3.696C76.5495 3.312 76.7415 2.856 76.7415 2.328C76.7415 1.776 76.5495 1.296 76.1655 0.912C75.7815 0.527999 75.3015 0.335999 74.7735 0.335999C74.2215 0.335999 73.7655 0.551999 73.3815 0.935999C72.9975 1.32 72.8055 1.8 72.8055 2.328Z" fill="#160248" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-center s-welcome">Syncing Products</p>
                    </div>
                    <div>
                        <p className="text-center mt-5 mb-2" style={{ fontSize: "17px" }}> Please wait while Copy.AI syncs all your products to the app</p>
                    </div>

                </div>

                {this.state.completedProducts === this.state.totalProducts ? "" :
                    <div className="form-group sync-loader-div mb-5">
                        <Spinner accessibilityLabel="Spinner example" size="large" />
                    </div>
                }


                <div className="col-md-12 col-sm-12 col-12 mb-3 step-icon-div">
                    {this.state.totalProducts != "" ?
                        <p className="text-center mt-5 mb-2" style={{ fontSize: "21px", fontWeight: "400" }}>
                            {this.state.completedProducts}/{this.state.totalProducts} Products Synced</p>
                        : ""}
                    {this.state.remainingTime != "" ?
                        <p className="text-center mt-2 mb-2">Estimated time remaining: {minute}  {second} </p>
                        : ""}
                    {this.state.remainingTime != "" ?
                        <p className="text-center mt-2 mb-2">This process will continue to run in the background and not be interrupted if you leave this page </p>
                        : ""}

                </div>
                <div className="m-auto col-md-4 col-sm-4 col-4 mt-5">
                    {this.state.completedProducts === this.state.totalProducts ?
                        <Button primary onClick={() => {
                            this.reloadTheApp()
                        }}>
                            Continue
                </Button>
                        : ""}

                </div>

            </div>
        )
    }
}

export default ProductSyncing
