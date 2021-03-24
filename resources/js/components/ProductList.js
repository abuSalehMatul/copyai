import React, { Component, useState } from 'react'
import { ResourceList, Card, Icon, Thumbnail, ResourceItem, Badge, Tooltip } from "@shopify/polaris"
import {
    SearchMinor
} from '@shopify/polaris-icons';
import ProductFilter from "./ProductFilter"
import ProductPagination from "./ProductPagination";

export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            products: [],
            selectedVendor: [],
            selectedType: "",
            selectedTaggedWith: "",
            selectedSortBy: "",
            selectedStatus: [],
            totalPage: "",
            listHead: "",
            currentPage: 1,
            totalProducts: 1,
            thisPage: 1,
            previousPageUrl: "",
            nextPageUrl: "",
            currentFilterType: "",
            productFetchLink: this.props.shop.server + '/get-products/' + this.props.shop.shop + "?page=1"
        }
        this.getProducts();
    }


    componentDidUpdate() {
        let li = document.querySelectorAll(".Polaris-ResourceList__ItemWrapper");
        if (li[0] && window.screen.width < 600) {
            li[0].style.display = "none";
        }
    }

    getProducts() {
        axios.get(this.state.productFetchLink)
            .then((response) => {
                this.setState({
                    products: response.data.data,
                    totalPage: Math.ceil(response.data.total / response.data.per_page),
                    currentPage: response.data.current_page,
                    thisPage: response.data.data.length,
                    totalProducts: response.data.total,
                    nextPageUrl: response.data.next_page_url,
                    previousPageUrl: response.data.prev_page_url
                }, () => {
                    let headerArr = this.getHeaderItems();
                    let tem = this.state.products;
                    tem.unshift(headerArr)
                    this.setState({
                        products: tem
                    })
                });

            })
            .catch((error) => {
                console.log(error);
            });
    }
    getHeaderItems() {
        return {
            product_id: "matulh",
            status: "matulh",
            image: "matulh",
            title: "",
            body_html: "h",
            vendor: "matulh",
            type: "matulh",
            handle: "h",
            published_scope: "h",
            tags: "",
            variants: "matulh"
        }
    }


    getInventory(variants) {
        if (variants == "matulh") {
            return <div className="stock-count-div header-title">Inventory</div>
        }
        let totalVariants = variants.length;
        let inventoryQuantity = 0;
        variants.forEach(variant => {
            inventoryQuantity = parseInt(variant.inventory_quantity + inventoryQuantity);
        });
        if (inventoryQuantity == 0) {
            return <div className="stock-count-div"><span className="stock-zero-num"> {inventoryQuantity} </span>  in stock for  {totalVariants}  variants </div>
        } else {
            return <div className="stock-count-div"> {inventoryQuantity} in stock for {totalVariants} variants</div>
        }
    }

    getStatus(status) {
        if (status == "matulh") {
            return <span className="header-title">Status</span>
        }
        if (status == 'active') return <div><Badge status="success">Active</Badge></div>
        return <div><Badge status="warning">Draft</Badge></div>
    }

    productImage(image) {
        if (image == "matulh") {
            return <span className="header-title">Product</span>
        }
        if (image != null) {
            return <Thumbnail
                source={image.src}
                alt="Black choker necklace"
            />
        }
        return <div className="awDZq _21KaY">
            <svg viewBox="0 0 20 20" className="_1nZTW xvNMs">
                <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v15A1.5 1.5 0 0 0 2.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 17.5 1h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM16.499 17H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path>
            </svg>
        </div>
    }

    filter(type, value) {
        let filterEvent = 'copy_filter_product, type: ' + type;
       
        if(this.state.currentFilterType != type){
            gtag('event', filterEvent, {
                'event_category' : 'filter_product',
                'event_label' : 'two',
            });
            this.setState({
                currentFilterType: type
            })
        }
        if (type == "query_string") {
            this.setState({
                searchKey: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            }
            )

        }
        if (type == 'productVendor') {
            this.setState({
                selectedVendor: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            }
            )
        }
        if (type == "taggedWith") {
            this.setState({
                selectedTaggedWith: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            })
        }
        if (type == "sort_by") {
            this.setState({
                selectedSortBy: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            })
        }

        if (type == 'statuses') {
            this.setState({
                selectedStatus: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            })
        }
        if (type == "productType") {
            this.setState({
                selectedType: value,
                currentPage: 1
            }, () => {
                this.setFetchLinkAndFetch();
            })
        }

    }

    setFetchLinkAndFetch() {
        this.setState({
            productFetchLink: this.generateLink()
        }, () => { this.getProducts() })
    }

    generateLink() {
        return this.props.shop.server + '/get-products/' + this.props.shop.shop + "?page=" + this.state.currentPage +
            "&query=" + this.state.searchKey + "&tagged_with=" + this.state.selectedTaggedWith + "&sory_by=" + this.state.selectedSortBy +
            "&vendor=" + this.state.selectedVendor + "&type=" + this.state.selectedType + "&statuses=" + this.state.selectedStatus
    }

    paginationLink(link, ittr) {
        this.setState({
            currentPage: parseInt(this.state.currentPage + ittr)
        }, () => {
            this.setState({
                productFetchLink: this.generateLink()
            }, () => { this.getProducts() })
        })
    }

    getInfoIcon(productId, optimized) {
        if (productId != "matulh") {
            if (typeof optimized == 'undefined') {
                return <Tooltip><svg version="1.1" height="15px" id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 512 512"
                    style={{ enableBackground: "new 0 0 512 512", opacity: ".5" }}
                    xmlSpace="preserve">
                    <g>
                        <g>
                            <polygon points="51.2,353.28 0,512 158.72,460.8" />
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


                </svg>
                </Tooltip>
            }
            else {
                return <Tooltip>
                    <svg version="1.1" id="Capa_1" height="15px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 330 330" style={{ enableBackground: "new 0 0 330 330" }} fill="#71cc41" xmlSpace="preserve">
                        <g>
                            <path d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300
		c-74.44,0-135-60.561-135-135S90.56,30,165,30s135,60.561,135,135S239.439,300,165,300z"/>
                            <path d="M226.872,106.664l-84.854,84.853l-38.89-38.891c-5.857-5.857-15.355-5.858-21.213-0.001
		c-5.858,5.858-5.858,15.355,0,21.213l49.496,49.498c2.813,2.813,6.628,4.394,10.606,4.394c0.001,0,0,0,0.001,0
		c3.978,0,7.793-1.581,10.606-4.393l95.461-95.459c5.858-5.858,5.858-15.355,0-21.213
		C242.227,100.807,232.73,100.806,226.872,106.664z"/>
                        </g>

                    </svg>
                </Tooltip>
            }


        }
    }

    render() {

        return (
            <div>
                <div className="col-md-12 col-sm-12 col-12 col-lg-12 positioned-as-row pl-0 mt-md-0 mt-5 mb-md-0 mb-5">
                    <p className="select-a-product">Select A Product To Begin</p>
                    <p>Copy.Ai automatically optimize the description of any product in few clicks</p>
                </div>
                <div>
                    <ProductPagination data={{
                        nextPageUrl: this.state.nextPageUrl,
                        previousPageUrl: this.state.previousPageUrl,
                        thisPage: this.state.thisPage,
                        totalProducts: this.state.totalProducts,
                        totalPage: this.state.totalPage,
                        currentPage: this.state.currentPage,
                        paginationLink: this.paginationLink.bind(this)
                    }}></ProductPagination>
                </div>
                <div className="positioned-as-row w-100">
                    <Card>
                        <ResourceList
                            resourceName={{ singular: 'product', plural: 'products' }}
                            filterControl={
                                <ProductFilter data={{
                                    shop: this.props.shop.shop,
                                    server: this.props.shop.server,
                                    filter: this.filter.bind(this)
                                }} />
                            }
                            items={this.state.products}
                            renderItem={(item) => {
                                const { id, title, vendor, status, type, tags, optimized, handle, variants, image, product_id } = item;

                                return (
                                    <ResourceItem
                                        id={id}
                                        onClick={() => {
                                            this.props.shop.stateChange('optimize', 2, item);
                                            gtag('event', 'copy_product_selected_for_optimized', {
                                                'event_category' : 'selection_for_optimization',
                                                'event_label' : 'two',
                                            });
                                        }}
                                        accessibilityLabel={`View details for ${handle}`}
                                    >

                                        <div className="d-flex row resource-list">
                                            <div className="col-md-4 col-sm-4 col-6 d-flex pl-0">

                                                <div style={{ margin: "auto 0", paddingRight: "10px" }}>
                                                    <Tooltip dismissOnMouseOut content={typeof optimized == 'undefined'
                                                        ? "Product's description hasn't been optimized with Copy.AI" : "Product Description has been optimized with Copy.Ai"}>
                                                        {this.getInfoIcon(product_id, optimized)}
                                                    </Tooltip>
                                                </div>
                                                <div style={{margin:"auto 0"}}>
                                                    {this.productImage(image)}

                                                </div>
                                                <div className="product-title">
                                                    {title}
                                                </div>

                                            </div>
                                            <div className="col-md-1 col-sm-1 col-3 m-auto">
                                                {this.getStatus(status)}
                                            </div>

                                            <div className="col-md-3 col-sm-3 col-3 m-auto">

                                                {this.getInventory(variants)}
                                            </div>
                                            <div className="col-md-2 col-sm-2 col-6 pl-5 m-md-auto">
                                                <div className="">{type == "matulh" ? <span className="header-title">Type</span> : type}</div>
                                            </div>
                                            <div className="col-md-2 col-sm-2 col-6 m-md-auto">
                                                <div className="">{vendor == "matulh" ? <span className="header-title">Vendor</span> : vendor}</div>
                                            </div>

                                        </div>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </Card>

                </div>
                <div>
                    <ProductPagination data={{
                        nextPageUrl: this.state.nextPageUrl,
                        previousPageUrl: this.state.previousPageUrl,
                        thisPage: this.state.thisPage,
                        totalProducts: this.state.totalProducts,
                        totalPage: this.state.totalPage,
                        currentPage: this.state.currentPage,
                        paginationLink: this.paginationLink.bind(this)
                    }}></ProductPagination>
                </div>
            </div>
        )
    }
}

export default ProductList
