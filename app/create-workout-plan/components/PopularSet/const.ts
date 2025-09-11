export const set = {
  burnOffSet: [
    "登山者",
    "俯臥撐",
    "深蹲",
    "開合跳",
    "原地高抬腿",
    "側身轉體",
    "空氣跳繩",
    "仰臥起坐",
    "平板支撐",
    "俯臥撐拍肩",
  ],
  legsTraningSet: [
    "深蹲",
    "硬舉",
    "腿推",
    "腿彎",
    "腿伸",
    "蹲舉",
    "蹲跳",
    "登山者",
  ],
};

export const options: {
  title: string;
  description: string;
  key: keyof typeof set;
}[] = [
  {
    title: "初階燃脂組合",
    description: "燃脂組合，適合初學者",
    key: "burnOffSet",
  },
  {
    title: "下肢肌群訓練",
    description: "訓練臀腿，適合中階有基礎體能者",
    key: "legsTraningSet",
  },
];
