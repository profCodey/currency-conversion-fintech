import React from "react";
import CookieConsent from "react-cookie-consent";

function CookieConsentBanner() {
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
                style={{ background: "#132144" }}
                buttonStyle={{
                    background: "#2196f3",
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
