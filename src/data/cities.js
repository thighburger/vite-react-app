export const cityData = {
    jeonnam: [
        { id: 'suncheon', name: '순천', desc: '국가정원과 습지의 도시', image: '/도시 사진/suncheon.png', coordinates: [127.4875, 34.9506] },
        { id: 'mokpo', name: '목포', desc: '낭만 가득한 항구 도시', image: '/도시 사진/mokpo.png', coordinates: [126.3922, 34.8118] },
        { id: 'yeosu', name: '여수', desc: '밤바다가 아름다운 곳', image: '/도시 사진/yeosu.png', coordinates: [127.6622, 34.7604] },
        { id: 'damyang', name: '담양', desc: '대나무 숲의 정취', image: '/도시 사진/damyang.png', coordinates: [126.9667, 35.3167] },
    ],
    gyeonggi: [
        { id: 'suwon', name: '수원', desc: '역사와 문화의 도시', image: '/도시 사진/suwon.png', coordinates: [127.0286, 37.2636] },
        { id: 'gapyeong', name: '가평', desc: '자연과 함께하는 휴식', image: '/도시 사진/gapyeong.png', coordinates: [127.5112, 37.8315] }
    ],
    gangwon: [
        { id: 'gangneung', name: '강릉', desc: '커피와 바다의 도시', image: '/도시 사진/gangneung.png', coordinates: [128.8761, 37.7519] },
        { id: 'chuncheon', name: '춘천', desc: '호반의 도시', image: '/도시 사진/chuncheon.png', coordinates: [127.7300, 37.8813] }
    ],
    // Add placeholders for others as needed
    default: []
};

export const provinceFocus = {
    'gyeonggi': { center: [127.2, 37.6], zoom: 3 },
    'gangwon': { center: [128.3, 37.8], zoom: 3 },
    'chungbuk': { center: [127.7, 36.8], zoom: 4 },
    'chungnam': { center: [126.8, 36.5], zoom: 4 },
    'jeonbuk': { center: [127.1, 35.7], zoom: 4 },
    'jeonnam': { center: [126.9, 34.9], zoom: 4 },
    'gyeongbuk': { center: [128.7, 36.4], zoom: 3 },
    'gyeongnam': { center: [128.3, 35.4], zoom: 4 },
    'jeju': { center: [126.55, 33.38], zoom: 6 },
    'seoul': { center: [127.0, 37.55], zoom: 5 } // If needed separately
};
