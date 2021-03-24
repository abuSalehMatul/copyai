import React, { Component } from 'react'
import { Button, Select } from "@shopify/polaris"
import ProductLineChart from "./ProductLineChart"

export class Analytics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentProduct: this.props.data.product,
            allProductsFormatedList:[],
            totalProductsNum: 10,
            totalRevenueGene: 1180,
            totalView: 1090
        }
        this.getAllProducts()
    }

    getAllProducts(){
        axios.get(this.props.data.server + "/get-product-with-variants/" + this.props.data.stateToken)
            .then(response => {
                console.log(response)
                if(response.data.length > 0){
                    let options =[];
                    response.data.forEach(product =>{
                        options.push({
                            "label": product.title,
                            "value": product.handle
                        });
                    })
                    this.setState({
                        allProductsFormatedList: options
                    })
                    if(this.state.currentProduct == ""){
                        this.setState({
                            currentProduct: options[0].value
                        })
                    }
                }
            })
    }
    render() {
        return (
            <div className="col-md-12 pl-0 pr-0">
                <div className="row mb-5">
                    <div className="col-md-4 col-sm-4 col-12 pl-md-0 pr-md-2">
                        <div className="bg-white box-tiles">
                            <p className="num mb-2">{this.state.totalProductsNum}</p>
                            <p className="num-text">Product Description Optimized</p>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-12 pl-md-1 pr-md-1">
                        <div className="bg-white box-tiles">
                            <p className="num mb-2">${this.state.totalRevenueGene}</p>
                            <p className="num-text">Total Revenue Generated</p>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-12 pl-md-2 pr-md-0">
                        <div className="bg-white box-tiles">
                            <p className="num mb-2">{this.state.totalView}</p>
                            <p className="num-text">Total Views</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row">
                        <div className="col-md-8 col-sm-8 col-8 pl-0">
                            <p className="mb-3 compare-result-text">Compare Results</p>
                            <p className="mb-3">Compare product specefic conversation rate and revenue</p>
                        </div>
                        <div className="col-md-4 col-sm-4 col-4 pr-0 row">
                            <div className="col-md-3 col-sm-3 col-3 m-auto" style={{fontSize: "16px"}}>
                                Product:
                            </div>
                            <div className="col-md-9 col-sm-9 col-9 m-auto pr-0">
                            <Select
                                options={this.state.allProductsFormatedList}
                                onChange={(value)=>{
                                    this.setState({
                                        currentProduct:value
                                    })
                                }}
                                value={this.state.currentProduct}
                                />
                            </div>
                        </div>
                    </div>
                <ProductLineChart data={{
                    currentProduct: this.state.currentProduct,
                    server: this.props.data.server,
                    stateToken: this.props.data.stateToken
                }}/>
                </div>
            </div>
        )
    }
}

export default Analytics
