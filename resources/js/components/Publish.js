import React, { Component } from 'react'
import { Button, Banner, Spinner, TextField } from "@shopify/polaris"
import { getProductImage, htmlDecode, removeNewLine, handleEdit } from "./Helper";
import ToastService from "./ToastService";
import { Editor } from '@tinymce/tinymce-react';
import { eyeIcon, copyIcon, reload } from "./IconSvg";
import SelfSelect from "./SelfSelect";

export class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productUpdateLink: this.props.data.server + '/update-description/' + this.props.data.shop,
            metaUpdateLink: this.props.data.server + '/update-meta/' + this.props.data.shop,
            getDescriptionLink: this.props.data.server + "/get-description/" + this.props.data.shop,
            currentPreviewLoading: -9,
            currentVariableName: "",
            craftValue: this.props.data.product.body_html,
            productDescriptionInitial: this.props.data.product.body_html,
            handleEditId: -100,
            product: this.props.data.product,
            description: [],
            currentlyShowing: 3,
            totalVariantsCount: 0,
            saveDescriptionLoading: 0,
            toastShow: 0,
            descriptionNotLoaded: 0,
            regenerateDescriptionLoading: 0,
            toastMessage: "",
            random: Math.random().toString(36).substring(7),
            toastType: "Basic"
        }
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.getDescription();

    }

    descriptionLoadCheck() {
        this.timeout = setTimeout(() => {
            if (this.state.description.length == 0) {
                this.setState({
                    descriptionNotLoaded: 1
                })
            }
        }, 17000)
    }

    componentWillReceiveProps(updatedProps) {
        this.setState({
            publishDescriptionLoading: updatedProps.data.publishDescriptionLoading,
            product: updatedProps.data.product,
            productDescriptionInitial: updatedProps.data.product.body_html,
            productUpdateLink: updatedProps.data.server + '/update-description/' + this.props.data.shop,
            metaUpdateLink: updatedProps.data.server + '/update-meta/' + this.props.data.shop,
            getDescriptionLink: updatedProps.data.server + "/get-description/" + this.props.data.shop,
        })
    }

    componentDidMount() {
        let top = "";
        if (window.screen.width >= 768) {
            window.addEventListener('scroll', event => {
                let fullDiv = document.getElementById("rich-editor-container-div");
                let fullDivRect = fullDiv.getBoundingClientRect();
                let colorElement = document.getElementsByClassName('tox-menu');
                for (let i = 0; i < colorElement.length; i++) {
                    let rect = colorElement[i].getBoundingClientRect();
                    if (top == "") top = rect.top;
                    colorElement[i].style.position = "fixed";
                    colorElement[i].style.top = (fullDivRect.top + 40) + "px";
                    colorElement[i].style.bottom = "oio"
                }
            })
        }

    }

    removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/(<([^>]+)>)/ig, '');
    }

    getDescription() {
        this.descriptionLoadCheck();
        this.setState({
            description: [],
            currentlyShowing: 3,
        })
        let description = this.removeTags(this.state.product.body_html);
        axios.post(this.state.getDescriptionLink, {
            'my_shopify_domain': this.props.data.shop,
            'current_description': description,
            'current_title': this.state.product.title,
            "format": this.state.product.format,
            'tone': this.state.product.tone,
            'industry': this.state.product.industry
        })
            .then(response => {
                clearTimeout(this.timeout);
                this.setDescription(response.data.ideas);
            })
    }

    regenerateDescription(){
        gtag('event', 'copy_generate_more_clicked', {
            'event_category' : 'generate_more',
            'event_label' : 'two',
        });
        let description = this.removeTags(this.state.product.body_html);
        axios.post(this.state.getDescriptionLink, {
            'my_shopify_domain': this.props.data.shop,
            'current_description': description,
            'current_title': this.state.product.title,
            "format": this.state.product.format,
            'tone': this.state.product.tone,
            'industry': this.state.product.industry
        })
        .then(response => {
            this.setDescription(response.data.ideas, 1);
        })
    }

    setDescription(ideas, regenerate = 0) {
        let description;
        if(regenerate == 0){
            description = [];
        }else{
            description = this.state.description;
        }
        ideas.forEach(idea => {
            description.push(idea.result)
        });
        this.setState({
            description: description
        }, () => {
            if (this.state.description.length < this.state.currentlyShowing) {
                this.setState({
                    currentlyShowing: this.state.description.length
                });
            }
            if(regenerate == 1){
                this.setState({
                    currentlyShowing: parseInt(this.state.currentlyShowing + 3),
                    regenerateDescriptionLoading: 0
                })
            }
        })
    }

    richTextEditor() {
        
        return <Editor
            initialValue={this.state.productDescriptionInitial}
            init={{
                height: 400,
                menubar: false,
                plugins: 'code',
                toolbar:
                    'undo redo | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | code',
            }}
            onEditorChange={this.handleEditorChange}
            value={this.state.productDescriptionInitial}

        />
    }

    formattazition(des) {
        des = htmlDecode(des);
        des = removeNewLine(des);
        return des;
    }

    copyFunction(descriptionId) {
        let copyText = document.getElementById(descriptionId);
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");

        this.props.data.toastActivation("Basic", "Copied");
    }


    handleEditorChange(content, editor) {
        this.setState({
            craftValue: content
        });
    }

    toastDismis() {
        this.setState({
            toastShow: false
        })
    }

    changeValues(type, data) {
        let tunningValue = 'tunning in step 3, type: '+ type + ", value:" + data;
        gtag('event', tunningValue, {
            'event_category' : 'tunning for optimization',
            'event_label' : 'two',
        });
        if (type == "change-tone") {
            let tem = this.state.product;
            tem.tone = data;
            this.setState({
                product: tem
            }, () => { this.getDescription() })
        }
        else if (type == "change-format") {
            let tem = this.state.product;
            tem.format = data;
            this.setState({
                product: tem
            }, () => { this.getDescription() })
        }
        else if (type == "change-industry") {
            let tem = this.state.product;
            tem.industry = data;
            this.setState({
                product: tem
            }, () => { this.getDescription() })
        }
    }


    //UI for the loading state ..... 
    loadingState() {
        return <div style={{ topBarBackground: "#00848e", topBarBackgroundLighter: "#1d9ba4", topBarColor: "#f9fafb", pFrameOffset: "0px" }}>
            <button style={{ width: "100%" }} className="Polaris-Button Polaris-Button--disabled Polaris-Button--loading" type="button" disabled="" aria-busy="true">
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
        </div>;
    }

    render() {
        let generatedCopies = [];
        if (this.state.description.length > 0) {
            for (let i = 0; i < this.state.currentlyShowing; i++) {
                let titleSection = <div className="mb-3 mt-3">
                    <span>Generated Copy {i + 1}</span>
                    <div className="float-right cursor-pointer" onClick={() => {
                        this.copyFunction('gen' + i);
                    }}>
                        {copyIcon()}
                    </div>
                </div>
                generatedCopies.push(
                    <div key={i} className="w-100 generated-copy-text mt-3">
                        <TextField
                            label={titleSection}
                            value={this.state.description[i]}
                            onChange={(value) => {
                                let temDescription = this.state.description;
                                temDescription[i] = value;
                                this.setState({
                                    description: temDescription
                                })
                            }}
                            multiline={4}
                            id={'gen' + i}
                        />

                    </div>);
            }

            if (this.state.description.length != this.state.currentlyShowing && this.state.description.length != 0) {
                generatedCopies.push(
                    <div key={787876} className="mt-3">
                        <div>
                            <Button primary onClick={() => {
                                gtag('event', 'copy_load_more_clicked', {
                                    'event_category' : 'load_more',
                                    'event_label' : 'two',
                                });
                                this.setState({
                                    currentlyShowing: this.state.description.length
                                })
                            }}>Load More</Button>
                        </div>
                    </div>
                )
            }
            if(this.state.description.length == this.state.currentlyShowing && this.state.description.length != 0){
                generatedCopies.push(
                    <div key={8007876} className="mt-3">
                        <div>
                            <Button loading={this.state.regenerateDescriptionLoading == 1} primary onClick={() => {
                                this.setState({
                                    regenerateDescriptionLoading: 1
                                })
                                this.regenerateDescription()
                            }}>Generate More</Button>
                        </div>
                    </div>
                )
            }

        } else {
            if (this.state.descriptionNotLoaded == 1) {
                generatedCopies.push(
                    <div className="mt-5 font-we-600 pl-0 pr-0" key={Math.random()}>
                        <p className="mb-3">Oops! Something went wrong while trying to fetch the optimized copies</p>
                        <div className="preview-link"

                            onClick={(e) => {
                                this.setState({
                                    descriptionNotLoaded: 0
                                })
                                this.getDescription()
                            }} type="button">
                            <span className="publish-preview-reload-text">{reload()}Click here to retry</span>
                        </div>
                    </div>
                )
            }
            else {
                generatedCopies.push(
                    <div className="col-md-12 mt-20p" key={Math.random()}>
                        <div className="m-auto" style={{ width: "9%" }}>
                            <Spinner accessibilityLabel="Spinner example" size="large" color="teal" />
                            <h4 className="optimizing-text">Optimizing</h4>
                        </div>
                    </div>
                );
            }

        }



        return (

            <div className="row mt-5">

                <div className="col-md-8 col-sm-8 col-12 pl-0 row h-100 pr-col-0 publish-box-sticky" >
                    <div className="pl-0 col-md-2 col-sm-2 pr-col-0">
                        {getProductImage(this.state.product)}
                    </div>
                    <div className="col-md-10 col-sm-10 col-12 row pl-0 pr-0 mt-md-0 mt-5">
                        <div className="col-md-12 col-sm-12 col-12 pl-0 mb-4">
                            <p className="product-title-publish">{this.state.product.title}</p>
                        </div>
                        <div className="col-md-4 col-sm-4 col-6 pr-0 pl-0 mt-3">


                            {this.state.currentPreviewLoading == 1 ?
                                this.loadingState()
                                :

                                <a style={{ padding: "0.48rem 1.6rem", borderRadius: "0px" }} className="Polaris-Button Polaris-Button__Content Polaris-Button--outline preview-link" target="_blank"
                                    href={"https://" + this.state.product.my_shopify_domain + "/products/" + this.state.product.handle + "?copypreview=aispace&load=yes&shop=" + this.props.data.shop}
                                    onClick={(e) => {
                                        this.props.data.updateMeta(this.state.product, this.state.craftValue, this.state.random);
                                    }} >
                                    <span className="publish-preview-eye-text">{eyeIcon()}Preview</span>
                                </a>}
                        </div>

                        <div className="col-md-4 col-sm-4 col-6 pr-0 mt-3">
                            <Button loading={this.state.publishDescriptionLoading == 1} onClick={() => {
                                this.setState({
                                    publishDescriptionLoading: 1
                                })
                                this.props.data.updateProduct(this.state.product, this.state.craftValue);
                            }} primary>Publish Copy</Button>
                        </div>
                    </div>
                    <div>
                        <p className="mt-5" style={{ fontSize: "17px", fontWeight: "600" }}>Product Description</p>
                        <p className="mt-2">Copy and paste snippet from the AI generated copies to optimize the description</p>
                    </div>
                    <div style={{ background: "white" }} className="col-md-12 col-sm-12 pl-0 pr-0 mt-3 " id="rich-editor-container-div">
                        {this.richTextEditor()}
                    </div>

                </div>
                <div className="col-md-4 col-sm-4 col-12 pr-0 border-left-pulishpage pl-col-0" >
                    <SelfSelect data={{
                        server: this.props.data.server,
                        shop: this.props.data.shop,
                        tone: this.state.product.tone,
                        format: this.state.product.format,
                        industry: this.state.product.industry,
                        stateToken: this.props.data.stateToken,
                        initiatedFrom:"step-3",
                        changeValues: this.changeValues.bind(this)
                    }} />
                    <hr></hr>
                    <div className="">
                        <p className="" style={{ fontSize: "17px", fontWeight: "600" }}>AI Generated Copies</p>
                        <p className="mt-2">Text generated by Copy.AI for this product</p>
                    </div>
                    <div>
                        {generatedCopies}
                    </div>
                </div>
            </div>
        )
    }
}

export default Publish