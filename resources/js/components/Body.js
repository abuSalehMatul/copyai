import React, { Component } from 'react'
import { Button, DisplayText } from "@shopify/polaris"
import Header from "./Header";
import OperationState from "./OperationState";
import ProductList from "./ProductList";
import OptimizeDescription from "./OptimizeDescription";
import Publish from "./Publish";
import Settings from "./Settings";
import ABTest from "./ABTest";
import ABTestProduct from "./ABTestProduct"
import SuccessModal from "./SuccessModal";
import Analytics from "./Analytics";
import ProductSyncing from "./ProductSyncing";
import ToastService from "./ToastService";
import { htmlDecode, removeNewLine } from "./Helper";

export class Body extends Component {
    constructor(props) {
        super(props);
        //this.server = window.app_url;
        this.server = window.location.origin;   /// server to interact with
        this.state = {
            activeMotherOperationState: "optimize",
            operationState: {
                "optimize": 1,
                "abtest": 1,
                "analytics": 1,
                "settings": 1
            },
            optimizedProduct: "",
            publishDescriptionLoading: 0,
            showSuccessModal: false,
            preserveState: '',
            optimizingProduct: "",
            tone: '',
            industry: "",
            productUpdateLink: this.server + '/update-description/' + this.props.shop.shop,
            metaUpdateLink: this.server + '/update-meta/' + this.props.shop.shop,
            toastShow: 0,
            toastMessage: "",
            toastType: "Basic",
            shopDetails: "",
            stateToken: this.props.shop.stateToken,
            allProductUpload: this.props.shop.allProductUpload

        };
       

    }

    // the application is stands upon few states. this function will handle the change of the states.. states are structed as 
    //parent states and it's child.. like 'optimize' is parentState and there are 3 child states of this {1,2,3} .. in combination
    // this 2 we can understand where the application is .. 
    stateChange(stateType, newState, product = "") {
        gtag('event', 'copy_state_change', {
            'event_category' : 'state',
            'event_label' : 'one',
        });
        this.setState({
            activeMotherOperationState: stateType,
        }, () => {
            let tem = {};
            tem[stateType] = newState
            tem = { ...this.state.operationState, ...tem }
            this.setState({
                operationState: tem
            });
            if (product != "") {
                this.setState({
                    optimizingProduct: product
                })
            }
        })
    }

    productOptimized(product) {
        this.setState({
            optimizedProduct: product,
            showSuccessModal: true,
            publishDescriptionLoading: 0
        })
    }

    closeSuccessModal() {
        this.setState({
            showSuccessModal: false
        })
    }

    changedSettings(tone, industry) {
        this.setState({
            tone: tone,
            industry: industry
        })
    }

    saveDescription(data) {
        data["my_shopify_domain"] = this.props.shop.shop;
        axios.post(this.server + "/update-variants/" + this.props.shop.shop, data)
            .then(response => {
                console.log(response)
            })
    }


    //update product descriptions
    updateProduct(product, description) {
        gtag('event', 'copy_publish_button_clicked', {
            'event_category' : 'publish_button',
            'event_label' : 'two',
        });
        axios.post(this.state.productUpdateLink, {
            'product_id': product.product_id,
            'description': description
        })
        .then((response) => {
            let tem = this.state.optimizingProduct;
            tem.body_html = description;
            this.setState({
                optimizingProduct:tem
            }, ()=>{
                setTimeout(() => {
                    this.productOptimized(product);
                }, 3000)
            })            

        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    //save data for preview
    updateMeta(product, description, random) {
        gtag('event', 'copy_preview_button_clicked', {
            'event_category' : 'preview_button',
            'event_label' : 'two',
        });
        axios.post(this.state.metaUpdateLink, {
            'my_shopify_domain': this.props.shop.shop,
            'product_id': product.product_id,
            'description': description,
            'random': random
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    formateData(data) {
        let formattedData = {};
        formattedData["my_shopify_domain"] = this.props.shop.shop;
        formattedData['product_id'] = data.product.product_id;
        formattedData["title"] = data.title;
        formattedData["description"] = data.description;
        formattedData['status'] = 1;
        return formattedData;
    }

    //toast dismiss global function..
    toastDismis() {
        this.setState({
            toastShow: false
        })
    }

    duplicate(data) {
        data = this.formateData(data);
        this.saveDescription(data);
    }

    toastActivation(toastType, toastMessage) {
        this.setState({
            toastShow: true,
            toastType: toastType,
            toastMessage: toastMessage
        })
    }


    render() {
        let currentOperation;  // variable to store current screen of operation.....

        // initialize the currenct screen variable, from mother and child states..
        if (this.state.operationState.optimize == 1 && this.state.activeMotherOperationState == "optimize") {
            currentOperation = <ProductList shop={{
                shop: this.props.shop.shop,
                server: this.server,
                stateChange: this.stateChange.bind(this)
            }}></ProductList>
        } else if (this.state.operationState.optimize == 2 && this.state.activeMotherOperationState == "optimize") {
            currentOperation = <OptimizeDescription
                data={{
                    product: this.state.optimizingProduct,
                    stateChange: this.stateChange.bind(this),
                    server: this.server,
                    shop: this.props.shop.shop,
                    stateToken: this.state.stateToken
                }}
            />
        }
        else if (this.state.operationState.optimize == 3 && this.state.activeMotherOperationState == "optimize") {
            currentOperation = <Publish data={{
                product: this.state.optimizingProduct,
                server: this.server,
                shop: this.props.shop.shop,
                publishDescriptionLoading: this.state.publishDescriptionLoading,
                stateToken: this.state.stateToken,
                productOptimized: this.productOptimized.bind(this),
                saveDescription: this.saveDescription.bind(this),
                stateChange: this.stateChange.bind(this),
                updateProduct: this.updateProduct.bind(this),
                updateMeta: this.updateMeta.bind(this),
                toastActivation: this.toastActivation.bind(this)
            }} />

        }

        if (this.state.operationState.settings == 1 && this.state.activeMotherOperationState == "settings") {
            gtag('event', 'copy_settings_tab_opened', {
                'event_category' : 'settings_tab',
                'event_label' : 'two',
            });
            currentOperation = <Settings data={{
                server: this.server,
                shop: this.props.shop.shop,
                toastActivation: this.toastActivation.bind(this),
                stateToken: this.state.stateToken
            }} />
        }
        if (this.state.operationState.abtest == 1 && this.state.activeMotherOperationState == "abtest") {
            currentOperation = <ABTest data={{
                server: this.server,
                shop: this.props.shop.shop,
                stateToken: this.state.stateToken,
                stateChange: this.stateChange.bind(this)
            }}>

            </ABTest>
        }
        if (this.state.operationState.abtest == 2 && this.state.activeMotherOperationState == "abtest") {
            currentOperation = <ABTestProduct data={{
                server: this.server,
                shop: this.props.shop.shop,
                product: this.state.optimizingProduct,
                changedSettings: this.changedSettings.bind(this),
                duplicate: this.duplicate.bind(this),
                publishDescription: this.publishDescription.bind(this),
                updateMeta: this.updateMeta.bind(this)
            }}>

            </ABTestProduct>
        }
        if(this.state.operationState.analytics == 1 && this.state.activeMotherOperationState == "analytics"){
            gtag('event', 'copy_analytics_tab_opened', {
                'event_category' : 'analytics_tab',
                'event_label' : 'two',
            });
            currentOperation = <Analytics 
            data={{
                server: this.server,
                shop: this.props.shop.shop,
                product: this.state.optimizingProduct,
                stateToken: this.state.stateToken
            }}>

            </Analytics>
        }

        if(this.state.allProductUpload == 0){
            currentOperation = <ProductSyncing 
            data={{
                server: this.server,
                shop: this.props.shop.shop,
                stateToken: this.state.stateToken
            }}>

            </ProductSyncing>
        }
        return (
            <div className="body mb-5">
                {this.state.toastShow == 1 ? <ToastService data={{
                    toastDismis: this.toastDismis.bind(this),
                    toastMessage: this.state.toastMessage,
                    toastType: this.state.toastType
                }}></ToastService> : ""}

                {this.state.showSuccessModal == true ? <SuccessModal data={{
                    optimizedProduct: this.state.optimizedProduct,
                    closeSuccessModal: this.closeSuccessModal.bind(this),
                    shop: this.props.shop.shop
                }}
                ></SuccessModal> : ""}
                {this.state.allProductUpload == 1 ? 
                <Header data={{
                    server: this.server,
                    stateChange: this.stateChange.bind(this),
                    operationState: this.state.operationState,
                }}></Header>
                : ""}
                
                {this.state.allProductUpload == 1 ?<hr className="header-line" style={{ marginTop: "0" }}></hr> : ""} 
                {this.state.activeMotherOperationState == "optimize" && this.state.allProductUpload == 1 ? <OperationState data={{
                    optimizingProduct: this.state.optimizingProduct,
                    operationState: this.state.operationState,
                    stateChange: this.stateChange.bind(this)
                }}></OperationState> : ""}

                {this.state.activeMotherOperationState == "optimize" ? <hr></hr> : ""}
                
                {currentOperation}
            </div>

        );

    }
}

export default Body
