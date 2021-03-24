import React, { Component } from 'react'
import { ChoiceList, Heading, Icon, Sheet, Button, TextField } from "@shopify/polaris"
import {
  SearchMinor, MobileCancelMajor
} from '@shopify/polaris-icons';

export class ProductFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allVendors: [],
      allTypes: [],
      queryString: "",
      productVendor: "",
      productType: "",
      statuses: [],
      taggedWith: "",
      sheetActive: false,
      sortedValue: "by_title_asc"
    }
    this.getFilterData();
  }

  clearFilter(type) {
    this.setState({
      [type]: ""
    }, () => {
      this.props.data.filter(type, "");
    })
  }

  clearFilterButton(filterType) {
    return <Button onClick={() => {
      this.clearFilter(filterType);
    }} plain disabled={this.state[filterType] == ""}>Clear</Button>
  }

  getFilterData() {
    axios.get(this.props.data.server + '/get-filtering-values/' + this.props.data.shop)
      .then((response) => {
        this.setState({
          allTypes: response.data.types,
          allVendors: response.data.vendors
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggleShowMoreItem(key) {
    $("#" + key).toggle(300);
    $("#"+ key + "d").toggle(50);
    $("#"+ key + "u").toggle(50);
  }

  render() {
    let allVendor = [];
    let allType = [];
    let downArrow = <svg height="21px" style={{ fill: "rgba(95, 92, 98, 1)" }} viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M10 14a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 1 1 1.414-1.414L10 11.586l4.293-4.293a.999.999 0 1 1 1.414 1.414l-5 5A.997.997 0 0 1 10 14z"></path></svg>;
    let upArrow = <svg height="21px" viewBox="0 0 20 20" style={{ fill: "rgba(95, 92, 98, 1)" }} className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M15 13a.997.997 0 0 1-.707-.293L10 8.414l-4.293 4.293a.999.999 0 1 1-1.414-1.414l5-5a.999.999 0 0 1 1.414 0l5 5A.999.999 0 0 1 15 13z"></path></svg>;

    this.state.allVendors.forEach(vendor => {
      allVendor.push({ label: vendor, value: vendor });
    })
    this.state.allTypes.forEach(type => {
      if(type != "")
      allType.push({ label: type, value: type });
    })

    let sheet = <Sheet open={this.state.sheetActive} onClose={() => { this.setState({ sheetActive: !this.state.sheetActive }) }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            borderBottom: '1px solid #DFE3E8',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1.7rem',
            width: '100%',
          }}
        >
          <div className="col-md-10 col-sm-10 col-10">
            <Heading>More Filters</Heading>
          </div>
          <div className="col-md-2 col-sm-2 col-2 sheet-close-button">
            <Button
              accessibilityLabel="Cancel"
              icon={MobileCancelMajor}
              onClick={() => { this.setState({ sheetActive: !this.state.sheetActive }) }}
              plain
            />
          </div>
        </div>
        {/* header ends */}
        <div>
          <div className="" style={{ padding: "5px", overflowY:"auto", height:window.screen.height + "px" }}>
            {/* starts */}
            <div className="row show-more-item" onClick={() => { this.toggleShowMoreItem('productVendor') }}>
              <div className="col-md-10 col-sm-10 col-10 m-auto">
                <h4 className="more-filter-text">Product Vendor</h4>
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto " id="productVendord">
                {downArrow}
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto hide" id="productVendoru">
                {upArrow}
              </div>
            </div>
            <div className="show-more-item-details" id="productVendor">
              <ChoiceList
                choices={allVendor}
                selected={this.state.productVendor}
                onChange={(selected) => {
                  this.setState({
                    productVendor: selected
                  }, () => { this.props.data.filter('productVendor', this.state.productVendor) })
                }}
              />
              {this.clearFilterButton('productVendor')}
            </div>
            {/* one ends */}

            <div className="row show-more-item" onClick={() => { this.toggleShowMoreItem('taggedWith') }}>
              <div className="col-md-10 col-sm-10 col-10 m-auto">
                <h4 className="more-filter-text">Tagged with</h4>
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto" id="taggedWithd">
                {downArrow}
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto hide" id="taggedWithu">
                {upArrow}
              </div>
            </div>
            <div className="show-more-item-details" id="taggedWith">
              <TextField value={this.state.taggedWith} onChange={(value) => {
                this.setState({
                  taggedWith: value
                }, () => { this.props.data.filter('taggedWith', this.state.taggedWith) })
              }} />
              {this.clearFilterButton('taggedWith')}
            </div>
            {/* one ends */}
            <div className="row show-more-item" onClick={() => { this.toggleShowMoreItem('statuses') }}>
              <div className="col-md-10 col-sm-10 col-10 m-auto">
                <h4 className="more-filter-text">Status</h4>
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto" id="statusesd">
                {downArrow}
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto hide" id="statusesu">
                {upArrow}
              </div>
            </div>
            <div className="show-more-item-details" id="statuses">
              <ChoiceList
                allowMultiple
                choices={[
                  {
                    label: 'Active',
                    value: 'active',
                  },
                  {
                    label: 'Draft',
                    value: 'draft',
                  },
                  {
                    label: 'Archive',
                    value: 'archive',
                  },
                ]}
                selected={this.state.statuses}
                onChange={(selected) => {
                  this.setState({
                    statuses: selected
                  }, () => { this.props.data.filter('statuses', this.state.statuses) })
                }}
              />
              {this.clearFilterButton('statuses')}
            </div>
            {/* one ends */}
            {/* <div className="row show-more-item" onClick={()=>{this.toggleShowMoreItem('availability')}}>
              <div className="col-md-10 col-sm-10 col-10 m-auto">
                <h4 className="more-filter-text">Availability</h4>
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto">
                {downArrow}
              </div>
            </div> */}

            <div className="row show-more-item" onClick={() => { this.toggleShowMoreItem('productType') }}>
              <div className="col-md-10 col-sm-10 col-10 m-auto">
                <h4 className="more-filter-text">Product Type</h4>
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto" id="productTyped">
                {downArrow}
              </div>
              <div className="col-md-2 col-sm-2 col-2 m-auto pl-0 m-auto hide" id="productTypeu">
                {upArrow}
              </div>
            </div>
            <div className="show-more-item-details" id="productType">
              <ChoiceList
                choices={allType}
                selected={this.state.productType}
                onChange={(selected) => {
                  this.setState({
                    productType: selected
                  }, () => { this.props.data.filter('productType', this.state.productType) })
                }}
              />
              {this.clearFilterButton('productType')}
            </div>
          </div>
        </div>

      </div>
    </Sheet>

    return (
      <div className="row">
        {sheet}
        <div className="pl-0 col-md-4 col-sm-4 col-6 pr-md-2 pr-0">
          <TextField
            type="text"
            value={this.state.queryString}
            onChange={(value) => {
              this.setState({
                queryString: value
              }, () => { this.props.data.filter('query_string', value) })
            }}
            placeholder="Filter products"
            prefix={<Icon
              source={SearchMinor} />}
          />
        </div>
        <div className="col-md-2 col-sm-3 col-6 pl-0 pr-0">
          <div className="dropdown" style={{ topBarBackground: "#00848e", topBarBackgroundLighter: "#1d9ba4", topBarColor: "#f9fafb" }}>
            <button className="dropdown-toggle Polaris-Button Polaris-Button__Content Polaris-Button__Text" type="button" id="product-vendor" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Product Vendor
            </button>
            <div className="dropdown-menu" aria-labelledby="product-vendor">
              <ChoiceList
                choices={allVendor}
                selected={this.state.productVendor}
                onChange={(selected) => {
                  this.setState({
                    productVendor: selected
                  }, () => { this.props.data.filter('productVendor', this.state.productVendor) })
                }}
              />
              {this.clearFilterButton('productVendor')}
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-2 col-6 pl-0 pr-0" id="taggedWithDiv">
          <div className="dropdown" style={{ topBarBackground: "#00848e", topBarBackgroundLighter: "#1d9ba4", topBarColor: "#f9fafb" }}>
            <button className="dropdown-toggle Polaris-Button Polaris-Button__Content Polaris-Button__Text" type="button" id="tagged-with" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Tagged With
            </button>
            <div className="dropdown-menu" style={{ width: "110%" }} aria-labelledby="tagged-with">
              <TextField value={this.state.taggedWith} onChange={(value) => {
                this.setState({
                  taggedWith: value
                }, () => { this.props.data.filter('taggedWith', this.state.taggedWith) })
              }} />
              {this.clearFilterButton('taggedWith')}
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-3 col-6 pl-0 pr-0">
          <Button onClick={() => { this.setState({ sheetActive: !this.state.sheetActive }) }}>More Filters</Button>
        </div>
        <div className="col-md-2 col-sm-2 col-6 pl-0 pr-0">
          <div className="dropdown pl-md-3 pl-0" style={{ topBarBackground: "#00848e", topBarBackgroundLighter: "#1d9ba4", topBarColor: "#f9fafb" }}>
            <button className="dropdown-toggle Polaris-Button Polaris-Button__Content Polaris-Button__Text Polaris-Button__Icon" type="button" id="sort-order" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

              <svg height="18px" viewBox="0 0 20 20" className="" focusable="false" aria-hidden="true">
                <path d="M5.293 2.293a.997.997 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L7 5.414V13a1 1 0 1 1-2 0V5.414L3.707 6.707a1 1 0 0 1-1.414-1.414l3-3zM13 7a1 1 0 0 1 2 0v7.585l1.293-1.292a.999.999 0 1 1 1.414 1.414l-3 3a.997.997 0 0 1-1.414 0l-3-3a.997.997 0 0 1 0-1.414.999.999 0 0 1 1.414 0L13 14.585V7z">
                </path>
              </svg>
              Sort
            </button>
            <div className="dropdown-menu" aria-labelledby="sort-order">
              <ChoiceList
                choices={[
                  { label: 'Product Title (A-Z)', value: 'by_title_asc' },
                  { label: 'Product Title (Z-A)', value: 'by_title_desc' },
                  { label: 'Product Type (A-Z)', value: 'by_type_asc' },
                  { label: 'Product Type (Z-A)', value: 'by_type_desc' },
                  { label: 'Product Vendor (A-Z)', value: 'by_vendor_asc' },
                  { label: 'Product Vendor (Z-A)', value: 'by_vendor_desc' },
                  { label: 'Created (oldest first)', value: 'by_created_asc' },
                  { label: 'Created (newest first)', value: 'by_created_desc' },
                ]}
                selected={this.state.sortedValue}
                onChange={(selected) => {
                  this.setState({
                    sortedValue: selected
                  }, () => {
                    this.props.data.filter('sort_by', this.state.sortedValue)
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductFilter
