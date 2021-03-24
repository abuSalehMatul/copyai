
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AppProvider, Page, Frame } from "@shopify/polaris";
import '@shopify/polaris/dist/styles.css'
import StandBody from "./StandBody";
function Root() {
    return (
        <AppProvider>
            <Frame>
                <Page>
                    <StandBody></StandBody>
                </Page>
            </Frame>
        </AppProvider>
    );
}

export default Root;

if (document.getElementById('standapp')) {
    ReactDOM.render(<Root />, document.getElementById('standapp'));
}
