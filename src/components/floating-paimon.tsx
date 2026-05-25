import Image from "next/image";

const floatingBodySrc = "/assets/paimon/paimon-floating-body.png";
const floatingWingSrc = "/assets/paimon/paimon-floating-wing.png";
const hiSrc = "/assets/paimon/paimon-hi.png";

export function PaimonHi() {
  return (
    <div className="paimon-hi" aria-hidden="true">
      <Image
        src={hiSrc}
        alt=""
        width={262}
        height={394}
        className="paimon-hi__image"
      />
    </div>
  );
}

export function FloatingPaimon() {
  return (
    <div className="floating-paimon" aria-hidden="true">
      <div className="floating-paimon__stage">
        <Image
          src={floatingWingSrc}
          alt=""
          width={188}
          height={145}
          className="floating-paimon__wing"
          priority
        />
        <Image
          src={floatingBodySrc}
          alt=""
          width={321}
          height={477}
          className="floating-paimon__body"
          priority
        />
      </div>
    </div>
  );
}
