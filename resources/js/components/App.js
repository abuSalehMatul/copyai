
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AppProvider, Page, Frame } from "@shopify/polaris";
import '@shopify/polaris/dist/styles.css'
import Body from "./Body";


function Root() {
    return (
        <AppProvider>
            <Frame>
                <Page>
                    <Body shop={{
                        shop: shop,
                        stateToken: stateToken,
                        allProductUpload: allProductUpload
                    }}></Body>
                </Page>
            </Frame>
        </AppProvider>
    );
}

export default Root;

if (document.getElementById('app')) {
    var shop = $("#app").data('id');
    var stateToken = $("#app").data("state");
    var allProductUpload = $("#app").data("allupload");
    
    let lastChar = shop.slice(-1);
    if(lastChar == "/"){
        shop =  shop.substring(0, shop.length - 1);
    }
    gtag('event', 'copy_the_app_loaded', {
        'event_category' : 'app_loaded',
        'event_label' : 'two',
    });
    ReactDOM.render(<Root />, document.getElementById('app'));
}
