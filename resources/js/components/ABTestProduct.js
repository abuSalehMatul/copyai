import React, { Component } from 'react'
import { Button, TextField } from "@shopify/polaris"
import { getProductImage, htmlDecode, handleEdit } from "./Helper";
import { arrowOnAbTest, breker, eyeIcon, gear, plus } from "./IconSvg";

export class ABTestProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: this.props.data.product
        }
    }
    render() {
        let variables = [];
        for (let i = 0; i < this.state.product.variables.length; i++) {
            let titleSection = <div className="mb-3 mt-3">
                <span className="font-we-600">Variant <span style={{ color: " #425ae7" }}>{this.state.product.variables[i].title}</span></span>
                <div className="float-right cursor-pointer">
                    {eyeIcon()} <span className="publish-preview-eye-text">Preview</span>
                </div>
            </div>
            variables.push(
                <div className="col-md-12 col-sm-12 col-12 row pr-0 pl-0 mb-5">
                    <div className="col-md-8 col-sm-8 col-12 pl-0 pr-0">
                        <div key={Math.random()} className="w-100 mb-md-5 ab-spec-variable-text">
                            <TextField
                                label={titleSection}
                                value={this.state.product.variables[i].description}
                                onChange={() => { }}
                                multiline={4}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-12 pr-0 pl-0 pl-md-5 pl-sm-5 ab-variable-text-action">
                        <h1 className="percentage-num mb-1 best-percentage">58%</h1>
                        <h6>Conversion Rate</h6>
                        <h1 className="percentage-num mb-1 mt-3 mb-2">$7685</h1>
                        <h6>Revenue Generated</h6>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-6 pl-0 pr-2">
                                <Button onClick={()=>{

                                }}>Optimize</Button>
                            </div>
                            <div className="col-md-6 col-sm-6 col-6 pr-0 pl-2">
                                <Button onClick={()=>{
                                    this.props.data.duplicate({
                                        'product': this.state.product,
                                        'title': this.state.product.variables[i].title + " Duplicate",
                                        'description': this.state.product.variables[i].description,
                                        'status': 0
                                    });
                                }}>Duplicate</Button>
                            </div>
                            <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0 mt-3 mb-2">
                                <Button primary onClick={()=>{
                                    this.props.data.publishDescription(
                                        {
                                            'product': this.state.product,
                                            'title': this.state.product.variables[i].title,
                                            'description': this.state.product.variables[i].description,
                                            'status': 1
                                        }
                                    );
                                }}>Publish Copy</Button>
                            </div>
                            <div className="col-md-6 col-sm-6 col-6 pl-0 pr-2">
                                <TextField
                                    label="Display Frequency"
                                    type="number"
                                    value='1'
                                    onChange={()=>{}}
                                />
                            </div>
                            <div className="col-md-6 col-sm-6 col-6 pl-2 pr-0 mt-5">
                                <Button primary>Apply</Button>
                            </div>  
                        </div>
                    </div>
                </div>);
        }
        return (
            <div className="specif-ab-test">
                <div className="col-md-12 col-sm-12 col-12 row pr-0 pl-0">
                    <div className="col-md-4 cols-sm-4 col-12 row pl-0 pr-0">
                        <div className="col-md-4 col-sm-4 pr-col-0 pl-0 mb-4">
                            {getProductImage(this.state.product)}
                        </div>
                        <div className="col-md-8 col-sm-8 pl-0 pr-0">
                            <h1 className="font-we-600 mb-2" style={{ fontSize: "22px", whiteSpace: "nowrap" }}>{this.state.product.title}</h1>
                            <h1 className="percentage-num mb-1">38%</h1>
                            <h6>Avarage Conversion Rate</h6>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 cols-sm-4 pl-md-5 pl-0 pl-sm-5">
                        <h1 className="percentage-num mb-1 mt-5 best-percentage">58%</h1>
                        <h6>Best Conversion Rate</h6>
                    </div>
                    <div className="col-md-4 col-12 col-sm-4 mb-4 pl-0 pr-0">
                        <div className="pl-md-5 pl-sm-5 pl-0">
                            <h1 className="percentage-num mb-1 mt-5">38%</h1>
                            <h6>Revenue Created after Optimizationi</h6>
                        </div>
                    </div>
                </div>
                <hr className="mt-0"></hr>


                {variables}


            </div>

        )
    }
}

export default ABTestProduct
