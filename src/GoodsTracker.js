import { useState, useEffect } from "react";

const categories = [
  {
    name: "교복 떡메",
    items: [
      { name: "남자 하복", price: 2000 },
      { name: "여자 하복", price: 2000 },
      { name: "1학년 생활복", price: 2000 },
      { name: "2학년 생활복", price: 2000 },
      { name: "3학년 생활복", price: 2000 }
    ]
  },
  {
    name: "학홍 키링",
    items: [{ name: "학홍 키링", price: 2500 }]
  },
  {
    name: "학교 전경 엽서",
    items: [{ name: "학교 전경 엽서", price: 1500 }]
  },
  {
    name: "디미맵",
    items: [{ name: "학교 건물 스티커", price: 1000 }]
  },
  {
    name: "띠부띠부씰",
    items: [{ name: "3개 세트", price: 2000 }]
  },
  {
    name: "디미 부적",
    items: [{ name: "3개 세트", price: 1500 }]
  }
];

export default function GoodsTracker() {
  const [goods, setGoods] = useState(() => {
    const saved = localStorage.getItem("hakHongGoods");
    return saved
      ? JSON.parse(saved)
      : categories.map((category) => ({
          name: category.name,
          items: category.items.map((item) => ({ ...item, sold: 0 }))
        }));
  });

  useEffect(() => {
    localStorage.setItem("hakHongGoods", JSON.stringify(goods));
  }, [goods]);

  const handleAdjust = (categoryIndex, itemIndex, delta) => {
    setGoods((prevGoods) =>
      prevGoods.map((category, cIndex) =>
        cIndex === categoryIndex
          ? {
              ...category,
              items: category.items.map((item, iIndex) =>
                iIndex === itemIndex
                  ? { ...item, sold: Math.max(0, item.sold + delta) }
                  : item
              )
            }
          : category
      )
    );
  };

  const totalRevenue = goods.reduce(
    (sum, category) =>
      sum +
      category.items.reduce((catSum, item) => catSum + item.price * item.sold, 0),
    0
  );

  const leftCategories = goods.slice(0, 3);
  const rightCategories = goods.slice(3);

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-hidden">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">
        🌸 학홍 굿즈 판매 현황 🌸
      </h1>

      <div className="flex justify-between w-full max-w-screen-xl gap-8">
        <div className="flex flex-col space-y-6 w-1/2 items-start">
          {leftCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white w-full p-6 rounded-3xl shadow-lg border border-gray-300"
            >
              <h2 className="text-2xl font-semibold mb-4 text-pink-600">
                {category.name}
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-pink-300 text-white text-lg">
                    <th className="p-4">상품명</th>
                    <th className="p-4">가격</th>
                    <th className="p-4">판매 수량</th>
                    <th className="p-4">조정</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b text-center text-lg">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">{item.price}원</td>
                      <td className="p-4">{item.sold}</td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleAdjust(categoryIndex, itemIndex, -1)
                          }
                          className="bg-pink-500 text-white px-4 py-2 rounded-full mx-2"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            handleAdjust(categoryIndex, itemIndex, 1)
                          }
                          className="bg-pink-500 text-white px-4 py-2 rounded-full mx-2"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-6 w-1/2 items-end">
          {rightCategories.map((category, i) => {
            const categoryIndex = i + 3;
            return (
              <div
                key={categoryIndex}
                className="bg-white w-full p-6 rounded-3xl shadow-lg border border-gray-300"
              >
                <h2 className="text-2xl font-semibold mb-4 text-pink-600">
                  {category.name}
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-pink-300 text-white text-lg">
                      <th className="p-4">상품명</th>
                      <th className="p-4">가격</th>
                      <th className="p-4">판매 수량</th>
                      <th className="p-4">조정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b text-center text-lg">
                        <td className="p-4">{item.name}</td>
                        <td className="p-4">{item.price}원</td>
                        <td className="p-4">{item.sold}</td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              handleAdjust(categoryIndex, itemIndex, -1)
                            }
                            className="bg-pink-500 text-white px-4 py-2 rounded-full mx-2"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              handleAdjust(categoryIndex, itemIndex, 1)
                            }
                            className="bg-pink-500 text-white px-4 py-2 rounded-full mx-2"
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-3xl font-bold text-pink-700">
        총 판매 금액: {totalRevenue.toLocaleString()}원
      </div>
    </div>
  );
}
