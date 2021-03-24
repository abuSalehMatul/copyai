import React, { Component } from 'react'
import { TextField, Button, Icon } from "@shopify/polaris"


export const htmlDecode = (str) => {
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    return str;
}

export const removeNewLine = (str) => {
    str = str.toString().replace(/(?:\r\n|\r|\n)/g, '<br>');;
    return str;
}

export const handleEdit = (id) => {
    $('#' + id).hide();
    $('#' + id + "_text_field").show()
    return id + "_text_field";
}

export const getProductImage = (product, func = "") => {
    if (product.image != null) {
        return <div className="sticky-positioning-div">
            <img className="optimizing-img" src={product.image.src}></img>
            {func != "" ? <ProductCurrentEdit data={
                {
                    product: product,
                    func: func
                }
            }></ProductCurrentEdit> : ""}
        </div>
    }
    return <div className="awDZq big-no-img-div sticky-positioning-div">
        <svg viewBox="0 0 20 20" className="_1nZTW big-no-img">
            <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v15A1.5 1.5 0 0 0 2.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 17.5 1h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM16.499 17H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path>
        </svg>
    </div>
}

class ProductCurrentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.data.product,
            description: this.props.data.product.body_html,
            currentPreviewLoading: -9,
            currentProcessing: 0,
            isDirty: 0,
            isEditing: 0,
        }
        this.revertDescription = this.revertDescription.bind(this);
        this.edittDescription = this.edittDescription.bind(this)
    }

    revertDescription() {
        this.setState({
            isDirty: 0,
            description: this.props.data.product.body_html,
            isEditing: 0
        })
    }

    edittDescription() {
        this.setState({
            isEditing: 1,
        })
    }

    render() {
        let edit = <div style={{ float: "right", cursor: "pointer" }} onClick={this.edittDescription}><svg version="1.1" fill="#555AE7" height="18px" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 512 512" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve">
            <g>
                <g>
                    <polygon points="51.2,353.28 0,512 158.72,460.8 		" />
                </g>
            </g>
            <g>
                <g>

                    <rect x="89.73" y="169.097" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -95.8575 260.3719)" width="353.277" height="153.599" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M504.32,79.36L432.64,7.68c-10.24-10.24-25.6-10.24-35.84,0l-23.04,23.04l107.52,107.52l23.04-23.04
               C514.56,104.96,514.56,89.6,504.32,79.36z"/>
                </g>
            </g>
        </svg> Edit </div>

        let revert = <div style={{ float: "right", cursor: "pointer" }} onClick={this.revertDescription}>
            <svg version="1.1" id="Capa_1" height="18px" fill="#D93025" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 438.536 438.536" style={{ enableBackground: "new 0 0 438.536 438.536" }}
                xmlSpace="preserve">
                <g>
                    <path d="M421.125,134.191c-11.608-27.03-27.217-50.347-46.819-69.949C354.7,44.639,331.384,29.033,304.353,17.42
		C277.325,5.807,248.969,0.005,219.275,0.005c-27.978,0-55.052,5.277-81.227,15.843C111.879,26.412,88.61,41.305,68.243,60.531
		l-37.12-36.835c-5.711-5.901-12.275-7.232-19.701-3.999C3.807,22.937,0,28.554,0,36.547v127.907c0,4.948,1.809,9.231,5.426,12.847
		c3.619,3.617,7.902,5.426,12.85,5.426h127.907c7.996,0,13.61-3.807,16.846-11.421c3.234-7.423,1.903-13.988-3.999-19.701
		l-39.115-39.398c13.328-12.563,28.553-22.222,45.683-28.98c17.131-6.757,35.021-10.138,53.675-10.138
		c19.793,0,38.687,3.858,56.674,11.563c17.99,7.71,33.544,18.131,46.679,31.265c13.134,13.131,23.555,28.69,31.265,46.679
		c7.703,17.987,11.56,36.875,11.56,56.674c0,19.798-3.856,38.686-11.56,56.672c-7.71,17.987-18.131,33.544-31.265,46.679
		c-13.135,13.134-28.695,23.558-46.679,31.265c-17.987,7.707-36.881,11.561-56.674,11.561c-22.651,0-44.064-4.949-64.241-14.843
		c-20.174-9.894-37.209-23.883-51.104-41.973c-1.331-1.902-3.521-3.046-6.567-3.429c-2.856,0-5.236,0.855-7.139,2.566
		l-39.114,39.402c-1.521,1.53-2.33,3.478-2.426,5.853c-0.094,2.385,0.527,4.524,1.858,6.427
		c20.749,25.125,45.871,44.587,75.373,58.382c29.502,13.798,60.625,20.701,93.362,20.701c29.694,0,58.05-5.808,85.078-17.416
		c27.031-11.607,50.34-27.22,69.949-46.821c19.605-19.609,35.211-42.921,46.822-69.949s17.411-55.392,17.411-85.08
		C438.536,189.569,432.732,161.22,421.125,134.191z"/>
                </g>

            </svg> Revert
        </div>;

        ///  let description = htmlDecode(this.state.description);
        return <div>
            <div className="row mt-5">
                <div className="col-9 col-md-9 col-sm-9 pl-0 pr-0">
                    <p className="step-indicator float-left pl-0">
                        Current Description
                    </p>
                </div>
                <div className="col-md-3 col-sm-3 col-3 pr-0 pl-0">
                    {this.state.isDirty == 0 ? edit : revert}
                </div>
            </div>
            <div className="current-product-description-edit-box mt-5">
                {this.state.isEditing == 0 ?
                    <div id="currentDescription" style={{ paddingLeft: "0" }} className="Polaris-TextField Polaris-TextField--hasValue"
                        dangerouslySetInnerHTML={{ __html: htmlDecode(this.state.description) }} />
                    :
                    <TextField

                        value={this.state.description}
                        onChange={(value) => {
                            this.setState({
                                description: value,
                                isDirty: 1
                            })
                        }}
                        multiline={3}
                    />}
            </div>

            <div className="row mt-5">
                <div className="col-md-4 col-sm-4 col-6 pl-0">
                    <div className="">


                        {this.state.currentPreviewLoading == 200 ?
                            <div style={{ topBarBackground: "#00848e", topBarBackgroundLighter: "#1d9ba4", topBarColor: "#f9fafb", pFrameOffset: "0px" }}>
                                <button style={{ width: "85.5px" }} className="Polaris-Button Polaris-Button--disabled Polaris-Button--loading" type="button" disabled="" aria-busy="true">
                                    <span className="Polaris-Button__Content">
                                        <span className="Polaris-Button__Spinner">
                                            <span className="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall">
                                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
                                                </svg>
                                            </span>
                                            <span role="status">
                                                <span className="Polaris-VisuallyHidden">Loading</span>
                                            </span></span><span className="Polaris-Button__Text">
                                        </span>
                                    </span>
                                </button>
                                <div id="PolarisPortalsContainer"></div>
                            </div>
                            :

                            <a className="Polaris-Button Polaris-Button__Content Polaris-Button--outline preview-link" target="_blank"
                                href={"https://" + this.state.product.my_shopify_domain + "/products/" + this.state.product.handle + "?aivapreview=aispace"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.data.func('update-meta', this.state.product.product_id, this.state.description)
                                    this.setState({
                                        currentPreviewLoading: 200
                                    })
                                    setTimeout(() => {
                                        this.setState({
                                            currentPreviewLoading: -9
                                        })
                                    }, 3000)
                                }} type="button">
                                Preview
                        </a>}


                        {/* <Button
                            loading={this.state.currentPreviewLoading == 200}
                            onClick={() => {
                                this.props.data.func('update-meta', this.state.product.product_id, this.state.description)
                                this.setState({
                                    currentPreviewLoading: 200
                                })
                                setTimeout(() => {
                                    this.setState({
                                        currentPreviewLoading: -9
                                    })
                                }, 3000)
                            }}
                            outline>Preview</Button> */}

                    </div>
                </div>
                <div className="col-md-5 col-sm-5 col-6 pl-0 pr-0">
                    <div>
                        <Button
                            loading={this.state.currentProcessing == 1}
                            disabled={this.state.isDirty == 0}
                            onClick={() => {
                                this.setState({
                                    currentProcessing: 1
                                })
                                this.props.data.func('update-product', this.state.product.product_id, this.state.description);
                            }}
                            primary>Publish Copy</Button>

                    </div>
                </div>
            </div>
        </div>
    }
}