import React, { Component } from 'react'
import { Modal, TextContainer } from "@shopify/polaris"

export class SuccessModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            optimizedProduct: this.props.data.optimizedProduct,
            shop: this.props.data.shop
        }
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            optimizedProduct: updatedProps.data.optimizedProduct
        })
    }
    render() {
        return (
            <div>
                <Modal
                    open={this.state.active}
                    onClose={() => {
                        this.props.data.closeSuccessModal()
                    }}
                    title="Congrats!"
                // primaryAction={{
                //     content: 'Optimize Another Product',
                //     onAction: ()=>{
                //         document.location.href = document.location.href;
                //     },
                // }}
                // secondaryActions={[
                //     {
                //         content: <a target="_blank" href={"https://"+this.state.optimizedProduct.my_shopify_domain + "/products/"+this.state.optimizedProduct.handle + '?publish=yes&shop='+this.state.shop} className="see_on_product_pge">See the Product Page</a>,
                //         onAction: ()=>{
                //              this.props.data.closeSuccessModal()

                //             // window.top.location.href = "https://"+this.state.optimizedProduct.my_shopify_domain + "/products/"+this.state.optimizedProduct.handle
                //         },
                //     },
                // ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>
                                Your product description for {this.state.optimizedProduct.title} has been updated with the
                                optimized copy. <br>
                                </br>
                                You can now check it out on the product page or optimize the description of another product.
                             </p>
                        </TextContainer>
                    </Modal.Section>
                   
                        <div className="Polaris-Modal-Footer">
                            <div className="Polaris-Modal-Footer__FooterContent">
                                <div className="Polaris-Stack Polaris-Stack--alignmentCenter">
                                    <div className="Polaris-Stack__Item Polaris-Stack__Item--fill"></div>
                                    <div className="Polaris-Stack__Item">
                                        <div className="Polaris-ButtonGroup">
                                            <div className="Polaris-ButtonGroup__Item">
                                                <a type="button" onClick={()=>{
                                                    this.props.data.closeSuccessModal()
                                                }} 
                                                href={"https://"+this.state.optimizedProduct.my_shopify_domain + "/products/"+this.state.optimizedProduct.handle + '?publish=yes&shop='+this.state.shop} 
                                                target="_blank" className="Polaris-Button see_on_product_pge">
                                                    <span className="Polaris-Button__Content">
                                                        <span className="Polaris-Button__Text">
                                                            See the Product Page
                                                        
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="Polaris-ButtonGroup__Item">
                                                <button onClick={()=>{ document.location.href = document.location.href;}} type="button" class="Polaris-Button Polaris-Button--primary">
                                                    <span className="Polaris-Button__Content">
                                                        <span className="Polaris-Button__Text">Optimize Another Product</span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </Modal>
            </div>
        )
    }
}

export default SuccessModal
