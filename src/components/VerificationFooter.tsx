import Image from "next/image";

export default function VerificationFooter() {
  return (
    <footer className="mainFooter">
      <div className="mainFooter__top">
        <div className="mainFooter__container">
          <div className="mainFooter__row">
            {/* Links Column (Right in RTL) */}
            <div className="mainFooter__linksSection">
              <div className="mainFooter__navGrid">
                {/* 1. عن أجير */}
                <div className="mainFooter__navCol">
                  <div className="mainFooter__topNavTitle">عن أجير</div>
                  <p>
                    <a href="https://ajeer.qiwa.sa/about" className="mainFooter__topNavLink">
                      عن أجير
                    </a>
                  </p>
                  <p>
                    <a href="https://ajeer.qiwa.sa/about_notices" className="mainFooter__topNavLink">
                      خدمات أجير
                    </a>
                  </p>
                </div>

                {/* 2. الدعم */}
                <div className="mainFooter__navCol">
                  <div className="mainFooter__topNavTitle">الدعم</div>
                  <p>
                    <a href="https://ajeer.qiwa.sa/support" className="mainFooter__topNavLink">
                      الدعم و المساعدة
                    </a>
                  </p>
                  <p>
                    <a href="https://ajeer.qiwa.sa/faq" className="mainFooter__topNavLink">
                      الأسئلة الشائعة
                    </a>
                  </p>
                </div>

                {/* 3. الشروط و الأحكام */}
                <div className="mainFooter__navCol">
                  <div className="mainFooter__topNavTitle">الشروط و الأحكام</div>
                  <p>
                    <a href="https://ajeer.qiwa.sa/terms" className="mainFooter__topNavLink">
                      الشروط والأحكام
                    </a>
                  </p>
                  <p>
                    <a href="https://ajeer.qiwa.sa/privacy_policy" className="mainFooter__topNavLink">
                      سياسة الخصوصية
                    </a>
                  </p>
                </div>

                {/* 4. تواصل معنا */}
                <div className="mainFooter__navCol">
                  <div className="mainFooter__topNavTitle">تواصل معنا</div>
                  <p className="mainFooter__socialsContainer" style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px" }}>
                    <a
                      href="https://twitter.com/AjeerSA"
                      className="mainFooter__socialsLink d-inline-block px-1"
                    >
                      <img
                        src="/images/x-twitter.svg"
                        alt="X"
                        style={{ width: "1.25rem", height: "1.3rem", display: "block" }}
                      />
                    </a>
                    <a
                      href="mailto:support@ajeer.com.sa"
                      aria-label="تواصل معنا عبر البريد الإلكتروني support@ajeer.com.sa"
                      className="mainFooter__socialsLink d-inline-block px-1"
                    >
                      <i className="icon-send" style={{ fontSize: "1.35rem", display: "inline-block" }}></i>
                    </a>
                    <a
                      href="tel:920011040"
                      aria-label="تواصل معنا عبر الهاتف 920011040"
                      className="mainFooter__socialsLink d-inline-block px-1"
                    >
                      <i className="icon-phone" style={{ fontSize: "1.25rem", display: "inline-block" }}></i>
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Separator Line */}
            <hr className="mainFooter__mobileSeparator" />

            {/* Logos Column (Left in RTL) */}
            <div className="mainFooter__logosSection">
              {/* Desktop view */}
              <div className="mainFooter__desktopLogosGroup">
                <div className="mainFooter__logoBox">
                  <a href="https://mlsd.gov.sa/">
                    <Image
                      src="/images/footer left 4th logo.png"
                      alt="MLSD"
                      width={160}
                      height={60}
                      style={{ height: "60px", width: "auto", objectFit: "contain" }}
                    />
                  </a>
                </div>
                <div className="mainFooter__logoBox">
                  <a href="https://takamolholding.com/">
                    <Image
                      src="/images/footer left 3rd logo.png"
                      alt="Takamol"
                      width={130}
                      height={70}
                      style={{ height: "70px", width: "auto", objectFit: "contain" }}
                    />
                  </a>
                </div>
                <div className="mainFooter__logoBox mainFooter__logoBox--tamkeen">
                  <a href="https://tamkeentech.sa/">
                    <Image
                      src="/images/footer left 2nd logo.svg"
                      alt="Tamkeen"
                      width={160}
                      height={60}
                      style={{ height: "60px", width: "auto", objectFit: "contain" }}
                    />
                  </a>
                </div>
                <div className="mainFooter__logoBox mainFooter__logoBox--dga">
                  <a href="https://raqmi.dga.gov.sa/platforms/DigitalStamp/ShowCertificate/441">
                    <Image
                      src="/images/footer left 1st logo.svg"
                      alt="Digital Government Authority"
                      width={240}
                      height={70}
                      style={{ height: "70px", width: "auto", maxWidth: "300px", objectFit: "contain" }}
                    />
                  </a>
                </div>
              </div>

              {/* Mobile view (split into 2 halves with continuous vertical line) */}
              <div className="mainFooter__mobileLogosGroup">
                <div className="mainFooter__mobileRightHalf">
                  <div className="mainFooter__mobileLogoItem">
                    <a href="https://mlsd.gov.sa/">
                      <Image
                        src="/images/footer left 4th logo.png"
                        alt="MLSD"
                        width={140}
                        height={50}
                        style={{ height: "50px", width: "auto", objectFit: "contain" }}
                      />
                    </a>
                  </div>
                  <div className="mainFooter__mobileLogoItem">
                    <a href="https://takamolholding.com/">
                      <Image
                        src="/images/footer left 3rd logo.png"
                        alt="Takamol"
                        width={100}
                        height={50}
                        style={{ height: "50px", width: "auto", objectFit: "contain" }}
                      />
                    </a>
                  </div>
                  <div className="mainFooter__mobileLogoItem">
                    <a href="https://tamkeentech.sa/">
                      <Image
                        src="/images/footer left 2nd logo.svg"
                        alt="Tamkeen"
                        width={140}
                        height={50}
                        style={{ height: "50px", width: "auto", objectFit: "contain" }}
                      />
                    </a>
                  </div>
                </div>

                <div className="mainFooter__mobileLeftHalf">
                  <div className="mainFooter__mobileLogoItem">
                    <a href="https://raqmi.dga.gov.sa/platforms/DigitalStamp/ShowCertificate/441">
                      <Image
                        src="/images/footer left 1st logo.svg"
                        alt="Digital Government Authority"
                        width={180}
                        height={55}
                        style={{ height: "55px", width: "auto", maxWidth: "280px", objectFit: "contain" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}