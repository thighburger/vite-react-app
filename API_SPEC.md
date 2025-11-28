# Backend API Specification

이 문서는 프론트엔드와 연동하기 위해 필요한 백엔드 API 명세서입니다.

## 1. 기본 설정
- **Base URL**: `http://localhost:8080` (개발 환경 예시)
- **Content-Type**: `application/json`

---

## 2. API 목록

### 2.1. 채팅 응답 생성 (Chat Response)
사용자의 메시지와 설정된 페르소나를 기반으로 AI 캐릭터의 응답을 생성합니다.

- **Endpoint**: `/api/chat`
- **Method**: `POST`

#### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `region` | String | Yes | 현재 여행 중인 도시 이름 (예: "순천", "목포") |
| `message` | String | Yes | 사용자가 입력한 메시지 |
| `persona` | String | No | 사용자가 설정한 가이드의 성격/말투 (예: "친절하고 활기찬 말투") |

**예시 (JSON):**
```json
{
  "region": "순천",
  "message": "맛집 추천해줘",
  "persona": "구수한 전라도 사투리를 쓰는 친근한 아저씨"
}
```

#### Response Body
| Field | Type | Description |
|---|---|---|
| `reply` | String | AI가 생성한 답변 텍스트 |

**예시 (JSON):**
```json
{
  "reply": "아따, 순천 왔으면 꼬막 정식은 꼭 먹어봐야제! 저기 시장통에 기가 막힌 집이 있는디 알려줄까?"
}
```

---

### 2.2. 캐릭터 이미지 생성 (Generate Character Image)
사용자가 입력한 외모 묘사를 바탕으로 캐릭터 이미지를 생성합니다.

- **Endpoint**: `/api/image/generate`
- **Method**: `POST`

#### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `prompt` | String | Yes | 캐릭터 외모에 대한 설명 (예: "한복을 입은 단발머리 소녀") |

**예시 (JSON):**
```json
{
  "prompt": "한복을 입은 단발머리 소녀, 수채화 스타일"
}
```

#### Response Body
| Field | Type | Description |
|---|---|---|
| `imageUrl` | String | 생성된 이미지의 URL |

**예시 (JSON):**
```json
{
  "imageUrl": "https://api.your-server.com/images/generated-character-123.png"
}
```

---

## 3. 구현 가이드 (Backend Developer 참고용)

### 기술 스택 제안
- **Language**: Python (FastAPI 또는 Flask 권장) - AI 라이브러리 활용에 유리
- **AI Model**: 
  - 채팅: OpenAI GPT-4o, Claude 3.5 Sonnet 등 LLM API 연동
  - 이미지: OpenAI DALL-E 3, Midjourney, 또는 Stable Diffusion 연동

### 프롬프트 엔지니어링 팁 (채팅)
백엔드에서 LLM에 요청을 보낼 때 다음과 같은 시스템 프롬프트를 구성하면 좋습니다:

```text
당신은 {region}의 여행 가이드입니다.
사용자가 설정한 페르소나: {persona}
위 페르소나를 완벽하게 연기하며 사용자의 질문에 답변하세요.
여행지에 대한 정확한 정보를 바탕으로 친절하게 안내해 주세요.
```
