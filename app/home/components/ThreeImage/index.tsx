import BorderImage from "@/app/components/BorderImage";
import classNames from "classnames";
import React from "react";
import image1 from "@/app/static/108.jpg";
import image2 from "@/app/static/109.jpg";
import image3 from "@/app/static/111.jpg";

const ThreeImage = () => {
  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "w-full",
        "justify-center",
        "items-center",
        "py-8",
        "md:py-12",
        "gap-8",
        "md:gap-10",
        "px-4"
      )}
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Three Images */}
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 justify-center w-full max-w-7xl">
        <BorderImage
          imageSrc={image1}
          information={{
            title: "Consistent Progress",
            content:
              "每天進步 1%，累積成非凡改變。你的對手不是別人，而是昨天的自己。只要開始，就已經贏了一半。",
          }}
        />
        <BorderImage
          imageSrc={image2}
          information={{
            title: "Smart Training",
            content:
              "不只是努力，更要方法對！透過專業指導與個人化訓練計畫，讓每一分努力都發揮最大效果，安全且高效地邁向更好的自己。",
          }}
        />
        <BorderImage
          imageSrc={image3}
          information={{
            title: "Balanced Living",
            content:
              "健身不只是鍛鍊身體，更是打造健康的生活習慣。透過運動、飲食與休息的完美平衡，讓活力成為你的日常狀態，迎接更有品質的每一天。",
          }}
        />
      </div>

      {/* Brand Story */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-7xl">
        <div
          className="text-2xl md:text-3xl font-bold flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          Better than yesterday.
        </div>
        <div
          className={classNames(
            "flex-1",
            "text-sm",
            "md:text-base",
            "leading-relaxed"
          )}
          style={{ color: "var(--text-secondary)" }}
        >
          在這個高速變化的時代，每一天都是自我挑戰的新契機。Neo
          致力於陪伴您走過每一程，無論是初學者還是健身老手，我們都有適合您的訓練計劃。
          <br />
          <br />
          透過精心設計的課程和專業教練的指導，我們幫助您不斷突破體能極限，邁向更健康、更強壯的自己。讓今天的微小進步，成為未來成功的基石，並在這個過程中激發出您無限的潛能。
        </div>
      </div>
    </div>
  );
};

export default ThreeImage;
