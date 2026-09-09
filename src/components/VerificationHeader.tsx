import Image from "next/image";

export default function VerificationHeader() {
  return (
    <header className="mainHeader">
      <div className="mainHeader__top">
        <div className="mainHeader__container">
          <div className="mainHeader__logoContainer">
            <a href="https://ajeer.qiwa.sa/">
              <Image
                src="/images/header top right logo.png"
                alt="Qiwa Ajeer"
                width={80}
                height={40}
                style={{ objectFit: "contain" }}
                priority
              />
            </a>
          </div>
          <div className="mainHeader__logoContainer mainHeader__logoContainer--right">
            <a href="https://mlsd.gov.sa/">
              <Image
                src="/images/header top left logo.png"
                alt="MLSD"
                width={150}
                height={42}
                style={{ objectFit: "contain" }}
                priority
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
