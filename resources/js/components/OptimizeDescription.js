import React, { Component } from 'react'
import { Button, DisplayText } from "@shopify/polaris"
import { getProductImage, htmlDecode, removeNewLine } from "./Helper";
import { editIcon, cancel, accept } from "./IconSvg"
import { Editor } from '@tinymce/tinymce-react';
import SelfSelect from "./SelfSelect";

export class OptimizeDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.data.product,
            moreSpecific: false,
            selectedTone: "",
            selectedIndustry: "",
            selectedFormat: "",
            editDescription: 0,
            temDescription: this.props.data.product.body_html,
            showModal: "close",
            richTextUsed: 0

        }
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.getDefaultIndustry();
        this.getDefaultTone();
        this.getDefaultFormat();
       // this.getIndustryOptions();
    }

    getDefaultIndustry() {
        axios.get(this.props.data.server + "/get-default-industry/" + this.props.data.shop)
            .then(response => {
                this.setState({
                    selectedIndustry: response.data
                })
            })
    }

    getDefaultTone() {
        axios.get(this.props.data.server + '/shop-tones/' + this.props.data.shop)
            .then((response) => {
                if (response.data == null || response.data == "") {
                    this.setDefaultTone();
                } else {
                    this.setState({
                        selectedTone: response.data,
                    })
                }
            })
    }

    setDefaultTone() {
        axios.get(this.props.data.server + "/shop-default-tone/" + this.props.data.shop)
            .then(response => {
                this.getDefaultTone();
            })
    }

    getDefaultFormat() {
        axios.get(this.props.data.server + '/shop-default-format/' + this.props.data.shop)
            .then((response) => {
                if (response.data == null || response.data == "") {
                    this.setDefaultFormat();
                } else {
                    this.setState({
                        selectedFormat: response.data
                    })
                }
            })
    }

    setDefaultFormat() {
        axios.post(this.props.data.server + '/set-shop-default-format', {
            "state_token": this.props.data.stateToken,
        })
            .then((response) => {
                if (response.data == null || response.data == "") {
                    this.setDefaultFormat();
                } else {
                    this.setState({
                        selectedFormat: response.data
                    })
                }
            })
    }

    handleEditorChange(content, editor) {
        if(this.state.richTextUsed == 0){
            gtag('event', 'copy_rich_editor_used_stp2', {
                'event_category' : 'rich_text',
                'event_label' : 'two',
            });
        }
        this.setState({
            temDescription: content,
            richTextUsed: richTextUsed++
        });
    }

    richTextEditor() {
        return <Editor
        initialValue={this.state.temDescription}
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
      />
    }

    changeValues(type, data){
        let tunningValue = 'tunning in step 2, type: '+ type + ", value:" + data;
        gtag('event', tunningValue, {
            'event_category' : 'tunning for optimization',
            'event_label' : 'two',
        });
        if(type == "change-tone"){
            this.setState({
                selectedTone: data
            })
        }
        else if (type == "change-format"){
            this.setState({
                selectedFormat: data
            })
        }
        else if(type == "change-industry"){
            this.setState({
                selectedIndustry: data
            })
        }
    }

    // closeSelfModal() {
    //     this.setState({
    //         showModal: "close"
    //     })
    // }


    render() {

        return (
            <div className="row mt-5">
                <div className="mt-md-0 mt-n2 mb-5 col-12 pl-0 operation-description-up">
                    <DisplayText size="large">Optimize Description</DisplayText>
                </div>

                <div className="col-md-4 col-sm-4 col-12 pl-0  pr-md-1 pr-0 image-left-side">

                    {getProductImage(this.state.product)}
                    <div className="mt-3">
                        <SelfSelect data={{
                            server: this.props.data.server,
                            shop: this.props.data.shop,
                            tone: this.state.selectedTone,
                            format: this.state.selectedFormat,
                            industry: this.state.selectedIndustry,
                            stateToken: this.props.data.stateToken,
                            initiatedFrom:"step-2",
                            changeValues: this.changeValues.bind(this)
                        }} />
                       
                    </div>
                </div>
                <div className="col-md-8 col-sm-8 col-12 pl-md-2rem pl-0 pr-0">
                    <div className="mt-md-0 mt-4 operation-description-down">
                        <DisplayText size="large">Optimize Description</DisplayText>
                    </div>
                    <div className="mt-2rem">
                        <p className="product-title-publish">{this.state.product.title}</p>
                    </div>
                    <div className="mt-2rem">
                        <div className="Polaris-Labelled__LabelWrapper">
                            <div className="Polaris-Label">
                                <label id="PolarisTextField4Label" htmlFor="PolarisTextField4" className="Polaris-Label__Text">
                                    Current Description of Your Product
                                </label>
                            </div>
                        </div>
                        <div style={{ background: "white" }} className="col-md-12 col-sm-12 pl-0 pr-0 mt-3">
                            {this.richTextEditor()}
                        </div>

                    </div>
                    <div className="mt-2rem">
                        <Button fullWidth primary onClick={() => {
                            gtag('event', 'copy_clicked_optimized_button_for_step_3', {
                                'event_category' : 'go_to_step_3',
                                'event_label' : 'two',
                            });
                            let tem = this.state.product;
                            tem.body_html = this.state.temDescription;
                            tem.format = this.state.selectedFormat;
                            tem.tone = this.state.selectedTone;
                            tem.industry = this.state.selectedIndustry
                            this.setState({
                                product: tem
                            }, () => { this.props.data.stateChange('optimize', 3, this.state.product) })

                        }}><span style={{ fontWeight: "600" }}>Optimize:</span> Make more copy</Button>
                    </div>
                </div>

            </div>
        )
    }
}

export default OptimizeDescription
