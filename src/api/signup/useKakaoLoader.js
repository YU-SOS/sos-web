import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: process.env.REACT_APP_KAKAO_MAP,
    libraries: ["clusterer", "drawing", "services"],
  })
}