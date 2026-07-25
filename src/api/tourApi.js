import axios from "axios";

export const BUSAN_AREA_CODE = "6";
export const hasTourApiKey = Boolean(
  import.meta.env.VITE_TOUR_API_KEY &&
  import.meta.env.VITE_TOUR_API_KEY !== "YOUR_DECODING_SERVICE_KEY",
);

const tourApi = axios.create({
  baseURL: "https://apis.data.go.kr/B551011/KorService2",
  timeout: 12000,
  params: {
    serviceKey: import.meta.env.VITE_TOUR_API_KEY,
    MobileOS: "ETC",
    MobileApp: "BusanTripPicker",
    _type: "json",
  },
});

function parse(response) {
  const api = response?.data?.response;
  if (!api) {
    const serviceError = response?.data?.OpenAPI_ServiceResponse?.cmmMsgHeader;
    throw new Error(
      serviceError?.returnAuthMsg ||
      serviceError?.errMsg ||
      "관광공사 API 응답 형식을 확인할 수 없습니다.",
    );
  }
  const code = String(api.header?.resultCode || "");
  if (code && !["0000", "00"].includes(code)) {
    throw new Error(api.header?.resultMsg || "관광정보 요청에 실패했습니다.");
  }
  const body = api.body || {};
  const raw = body.items?.item;
  const items = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];
  return {
    items,
    pageNo: Number(body.pageNo || 1),
    totalCount: Number(body.totalCount || 0),
  };
}

function checkKey() {
  if (!hasTourApiKey) throw new Error(".env에 VITE_TOUR_API_KEY를 설정해 주세요.");
}

async function request(path, params, signal) {
  checkKey();
  try {
    return parse(await tourApi.get(path, { params, signal }));
  } catch (error) {
    if (error.name === "CanceledError") throw error;
    if (error.response?.status) {
      throw new Error(`관광정보 요청에 실패했습니다. (HTTP ${error.response.status})`);
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("관광정보 서버의 응답 시간이 초과되었습니다.");
    }
    if (error.request && !error.response) {
      throw new Error("관광정보 서버에 연결할 수 없습니다. 네트워크 또는 배포 환경의 CORS 설정을 확인해 주세요.");
    }
    throw error;
  }
}

export const getDistricts = () =>
  request("/areaCode2", { areaCode: BUSAN_AREA_CODE, pageNo: 1, numOfRows: 100 });

export const getPlaces = ({
  contentTypeId = "12", sigunguCode = "", pageNo = 1, numOfRows = 12, arrange = "Q",
} = {}) =>
  request("/areaBasedList2", {
    areaCode: BUSAN_AREA_CODE,
    contentTypeId: contentTypeId || undefined,
    sigunguCode: sigunguCode || undefined,
    arrange, pageNo, numOfRows,
  });

export const searchPlaces = ({
  keyword, contentTypeId = "", pageNo = 1, numOfRows = 12, signal,
}) =>
  request("/searchKeyword2", {
    keyword: keyword?.trim(),
    areaCode: BUSAN_AREA_CODE,
    contentTypeId: contentTypeId || undefined,
    arrange: "A", pageNo, numOfRows,
  }, signal);

export const getFestivals = ({
  startDate, endDate = "", pageNo = 1, numOfRows = 12,
}) =>
  request("/searchFestival2", {
    areaCode: BUSAN_AREA_CODE,
    eventStartDate: startDate,
    eventEndDate: endDate || undefined,
    arrange: "A", pageNo, numOfRows,
  });

export const getCommonDetail = async (contentId) => {
  const result = await request("/detailCommon2", {
    contentId,
    pageNo: 1,
    numOfRows: 1,
  });
  return result.items[0] || null;
};

export const getIntroDetail = async (contentId, contentTypeId) => {
  const result = await request("/detailIntro2", {
    contentId, contentTypeId, pageNo: 1, numOfRows: 10,
  });
  return result.items[0] || null;
};

export const getDetailImages = async (contentId) => {
  const result = await request("/detailImage2", {
    contentId, imageYN: "Y", subImageYN: "Y", pageNo: 1, numOfRows: 30,
  });
  return result.items;
};
