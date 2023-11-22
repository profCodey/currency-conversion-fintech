import React from "react";
import CookieConsent from "react-cookie-consent";
import Cookies from "js-cookie";

function CookieConsentBanner() {
    let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
    let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
    let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
    return (
        <div>
            <CookieConsent
                location="top"
                buttonText="AGREE & PROCEED"
                enableDeclineButton
                declineButtonText="DECLINE"
                declineButtonStyle={{
                    background: "#fff",
                    fontSize: "10px",
                    color: "#2196f3",
                    borderRadius: "5px",
                    border: "1px solid #fff",
                    fontWeight: "bold",
                }}
                style={{ background: colorBackground }}
                buttonStyle={{
                    background: colorPrimary,
                    fontSize: "10px",
                    color: "#fff",
                    borderRadius: "5px",
                    border: "1px solid #fff",
                    fontWeight: "bold",
                }}
                cookieName="myCookieConsent">
                <p className="text-sm m-3">
                    This site uses cookies and related technologies, as
                    described in our privacy policy, for purposes that may
                    include site operation, analytics, enhanced user experience,
                    or advertising. You may choose to consent to our use of
                    these technologies, or manage your own preferences.
                </p>
            </CookieConsent>
        </div>
    );
}

export default CookieConsentBanner;
