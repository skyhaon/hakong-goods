import { useState, useEffect } from "react";

const categories = [
  {
    name: "교복 떡메",
    items: [
      { name: "남자 하복", price: 1500 },
      { name: "여자 하복", price: 1500 },
      { name: "1학년 생활복", price: 1500 },
      { name: "2학년 생활복", price: 1500 },
      { name: "3학년 생활복", price: 1500 }
    ]
  },
  {
    name: "학교 전경 엽서",
    items: [{ name: "학교 전경 엽서", price: 1500 }]
  },
  {
    name: "학교 건물 스티커",
    items: [{ name: "학교 건물 스티커", price: 1000 }]
  },
  {
    name: "띠부띠부씰",
    items: [
      { name: "1", price: 500 },
      { name: "2", price: 500 },
      { name: "3", price: 500 },
      { name: "4", price: 500 }
    ]
  },
  {
    name: "학교 건물 포스트잇",
    items: [
      { name: "1", price: 1000 },
      { name: "2", price: 1000 }
    ]
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

  const top3Items = goods
    .flatMap((category) =>
      category.items.map((item) => ({
        name: item.name,
        revenue: item.price * item.sold,
        sold: item.sold
      }))
    )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-hidden">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">
        🌸 학홍 굿즈 판매 현황 🌸
      </h1>

      <div className="flex justify-between w-full max-w-screen-xl gap-8">
        {/* 왼쪽 박스 */}
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

        {/* 오른쪽 박스 */}
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

      {/* 총 판매 금액 */}
      <div className="mt-10 text-3xl font-bold text-pink-700">
        총 판매 금액: {totalRevenue.toLocaleString()}원
      </div>

      {/* Top 3 굿즈 */}
      <div className="mt-8 w-full max-w-screen-md bg-yellow-100 border border-yellow-300 rounded-3xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">🔥 Top 3 인기 굿즈 🔥</h2>
        <ol className="list-decimal list-inside space-y-2 text-xl text-yellow-900">
          {top3Items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.sold}개 판매 ({item.revenue.toLocaleString()}원)
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
