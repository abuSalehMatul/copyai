import React, { Component } from 'react'
import { Pagination } from "@shopify/polaris"

export class ProductPagination extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        
        let total = this.props.data.totalProducts;
        let thisPage = this.props.data.thisPage;
        let hasNext = true;
        let hasPrevious = true;
        if(thisPage > total) thisPage = total;
        if(this.props.data.nextPageUrl == null) hasNext = false;
        if(this.props.data.previousPageUrl == null) hasPrevious = false;

        let label = "Results " + this.props.data.currentPage + "/" + this.props.data.totalPage;
        return (
            <div className="col-md-12 col-sm-12 col-12 pl-0 pr-0 row pagination-div position-relative">
                <div className="col-md-10 col-sm-10 col-5 pl-0">
                    <p className="pagination-info">Showing <span>{thisPage}</span> of <span>{total}</span> Products</p>
                </div>
                <div className="col-md-2 col-sm-2 col-7 pr-0 pl-0 position-relative pag">
                    <Pagination
                        label={label}
                        hasPrevious = {hasPrevious}
                        onPrevious={() => {
                            this.props.data.paginationLink(this.props.data.previousPageUrl, -1)
                        }}
                        hasNext = {hasNext}
                        onNext={() => {
                            this.props.data.paginationLink(this.props.data.nextPageUrl, 1)
                        }}
                    />
                </div>

            </div>
        )
    }
}

export default ProductPagination
