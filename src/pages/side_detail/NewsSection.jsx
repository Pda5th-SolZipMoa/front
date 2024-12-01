import React from 'react';

function NewsSection() {
  const newsItems = [
    {
      title: "성수동 1가 트리마제 실거래가, 시세, 주변정보",
      content: "직방시세 : 매매 10억 3,000 ~ 110억 5,000, 평균 1억 89/3.3㎡ - 단지 비교하기. 2022 2023 2024 4월 7일 1억 1.3억 트리마제 성동구 3.3㎡ 당 평균가격 2 - 실거래가",
      date: "다음 ˑ 2024.4.18"
    },
    {
      title: "성수동 트리마제 3대장 아파트 가성비 좋은 월세 서울숲",
      content: "성수대교, 강변북로, 올림픽대로, 동부간선도로 등 주요 도로 진입이 굉장히 편리하며 분당선 서울숲역은 도보 5분거리 입니다.",
      date: "네이버 ˑ 2024.4.18"
    },
    {
      title: "성수동 트리마제 3대장 아파트 가성비 좋은 월세 서울숲",
      content: "성수대교, 강변북로, 올림픽대로, 동부간선도로 등 주요 도로 진입이 굉장히 편리하며 분당선 서울숲역은 도보 5분거리 입니다.",
      date: "네이버 ˑ 2024.4.18"
    },
  ];

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="h5 mb-0">뉴스</h3>
        <button className="btn btn-link text-purple p-0">더보기 &gt;</button>
      </div>
      <div className="card-body">
        {newsItems.map((item, index) => (
          <div key={index} className="d-flex gap-3 mb-3">
            <div className="bg-light rounded" style={{width: '64px', height: '64px'}}></div>
            <div>
              <h4 className="h6 fw-medium">{item.title}</h4>
              <p className="small text-muted mb-1">{item.content}</p>
              <p className="small text-muted">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsSection;

