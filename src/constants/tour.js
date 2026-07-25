export const contentTypes = [
  ["", "전체"], ["12", "관광지"], ["14", "문화시설"], ["15", "축제·행사"],
  ["25", "여행코스"], ["28", "레포츠"], ["32", "숙박"], ["38", "쇼핑"], ["39", "음식점"],
];

export const typeName = (id) =>
  Object.fromEntries(contentTypes)[String(id)] || "관광정보";
