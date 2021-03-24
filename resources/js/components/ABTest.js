import React, { Component } from 'react'
import { Spinner, Card } from "@shopify/polaris"
import { getProductImage, htmlDecode, handleEdit } from "./Helper";
import { arrowOnAbTest, breker, gear, plus } from "./IconSvg";

export class ABTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allProducts: []
        }
        this.getProductWithVariantsDetails()
    }

    getProductWithVariantsDetails() {
        axios.get(this.props.data.server + "/get-product-with-variants/" + this.props.data.stateToken)
            .then(response => {
                this.setState({
                    allProducts: response.data
                })
            })
    }

    activeVariant(variants) {
        variants.forEach(val => {
            if (val.status == 1) {
                return val.title;
            }
        });
    }

    render() {
        let allProductsDetails = [];
        
        if (this.state.allProducts.length > 0) {
            for (let i = -1; i < this.state.allProducts.length; i++) {
                if (i == -1) {
                    allProductsDetails.push(
                        <div key={Math.random()} className="row mt-5 mb-2 hide-in-mobile">
                            <p className="col-md-4 col-sm-4 pl-0" >Products</p>
                            <p className="col-md-2 col-sm-2" >Total Variants</p>
                            <p className="col-md-2 col-sm-2" >Active Variants</p>
                            <p className="col-md-4 col-sm-4" >Conversion Rate</p>
                        </div>
                    )
                } else {
                    allProductsDetails.push(
                        <div key={Math.random()} className="abtest-initial-div mb-3">
                            <Card >
                                <div className="row pt-3 pb-3 pl-3 cursor-pointer" onClick={() => {
                                            this.props.data.stateChange('abtest', 2, this.state.allProducts[i]);
                                        }}>
                                    <div className="col-md-4 col-sm-4 col-10 pl-2 pr-0 row">
                                        <div className="col-md-4 col-sm-4 col-6 pl-0 pb-2 pt-2">
                                            {getProductImage(this.state.allProducts[i])}
                                        </div>
                                        <div className="col-md-8 col-sm-8 col-6 pr-0 m-auto">
                                            <h6 className="font-we-600">{this.state.allProducts[i].title}</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-2 col-sm-2 col-2" style={{ margin: "auto 0" }}>
                                        <h6 className="font-we-600">{this.state.allProducts[i].variables.length}</h6>
                                    </div>
                                    <div className="col-md-2 col-sm-2 col-4">
                                        <h6 className="font-we-600">{this.activeVariant(this.state.allProducts[i].variables)}</h6>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-8 row">
                                        <div className="col-md-5 col-sm-5 col-4 m-auto pl-0">
                                            <h3 className="percentage-num warning-percentage">38%</h3>
                                            <h6 className="font-we-600">Average</h6>
                                        </div>
                                        <div className="col-md-5 col-sm-5 col-4 m-auto">
                                            <h3 className="percentage-num best-percentage">58%</h3>
                                            <h6 className="font-we-600">Best Variant</h6>
                                        </div>
                                        <div className="col-md-2 col-sm-2 col-4 m-auto pr-0 abtest-arrow cursor-pointer">
                                            {arrowOnAbTest()}
                                        </div>
                                    </div>
                                </div>

                            </Card>
                        </div>

                    )
                }

            }
        }else{
            allProductsDetails.push(
                <div className="col-md-12 col-sm-12 col-12 m-auto"> 
                    <div className="m-auto" style={{width:"46px"}}>
                        <Spinner accessibilityLabel="Spinner example" size="large" />
                    </div>
                </div>
            )
        }
        return (

            <div>
                <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0">
                    <p className="mt-5" style={{ fontSize: "24px", fontWeight: "500" }}>A/B Test</p>
                    <p className="mt-3">Track and manage product description variants</p>
                </div>
                <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3">
                    {allProductsDetails}
                </div>
            </div>
        )
    }
}

export default ABTest
