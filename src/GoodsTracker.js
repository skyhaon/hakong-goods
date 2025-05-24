import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

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
    items: [{name: "학홍 키링", price: 2500}]
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
    items: [
      { name: "3개 세트", price: 2000 },
    ]
  },
  {
    name: "디미 부적",
    items: [
      { name: "3개 세트", price: 1500 }
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
    document.head.appendChild(link);
  }, []);
  

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

  const exportToExcel = () => {
    const flatData = goods.flatMap((category) =>
      category.items.map((item) => ({
        카테고리: category.name,
        상품명: item.name,
        가격: item.price,
        판매수량: item.sold,
        총액: item.price * item.sold
      }))
    );

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "굿즈 판매 현황");

    const now = new Date();
    const dateString = now.toISOString().split("T")[0];

    XLSX.writeFile(wb, `학홍굿즈판매_${dateString}.xlsx`);
  };

  return (
    <div className="flex flex-col items-center justify-start p-0 overflow-hidden w-full">
      <br />
      <h1 className="text-4xl font-bold text-black-600 mb-8">
        🌸 학홍 굿즈 판매 현황 🌸
      </h1>
      <div className="flex justify-between w-full gap-8">
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
                    <th className="p-2">상품명</th>
                    <th className="p-2">가격</th>
                    <th className="p-2">판매 수량</th>
                    <th className="p-2">조정</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b text-center text-lg">
                      <td className="p-5">{item.name}</td>
                      <td className="p-2">{item.price}원</td>
                      <td className="p-2">{item.sold}</td>
                      <td className="p-2">
                        <div className="flex flex-row items-center justify-center">
                          <button
                            onClick={() =>
                              handleAdjust(categoryIndex, itemIndex, 1)
                            }
                            className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-1"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              handleAdjust(categoryIndex, itemIndex, -1)
                            }
                            className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-1"
                          >
                            -
                          </button>
                        </div>
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
                      <th className="p-2">상품명</th>
                      <th className="p-2">가격</th>
                      <th className="p-2">판매 수량</th>
                      <th className="p-2">조정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b text-center text-lg">
                        <td className="p-5">{item.name}</td>
                        <td className="p-2">{item.price}원</td>
                        <td className="p-2">{item.sold}</td>
                        <td className="p-2">
                          <div className="flex flex-row items-center justify-center">
                            <button
                              onClick={() =>
                                handleAdjust(categoryIndex, itemIndex, 1)
                              }
                              className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-1"
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                handleAdjust(categoryIndex, itemIndex, -1)
                              }
                              className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-1"
                            >
                              -
                            </button>
                          </div>
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

      <div className="mt-10 text-3xl font-bold text-black-700">
        총 판매 금액:{" "}
        <span className="text-5xl font-extrabold text-pink-700">
          {totalRevenue.toLocaleString()}원
        </span>
      </div>

      <div className="mt-8 w-full max-w-screen-md bg-yellow-100 border border-yellow-300 rounded-3xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">
          🔥 Top 3 인기 굿즈 🔥
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-xl text-yellow-900">
          {top3Items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.sold}개 판매 ({item.revenue.toLocaleString()}원)
            </li>
          ))}
        </ol>
      </div>

      {/* 엑셀 다운로드 버튼 */}
      <button
        onClick={exportToExcel}
        className="mt-10 px-6 py-3 bg-green-500 text-white rounded-2xl text-xl shadow hover:bg-green-600 transition-all"
      >
        💾 일일 기록 정산
      </button>

      <br />
      <br />
    </div>
  );
}
